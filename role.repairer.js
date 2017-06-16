var roleBuilder = require('role.builder');
var Role = require('role.proto');
var $ = require('utils');
var logger = require('logger');

if (Memory.repairing == undefined) {
    Memory.repairing = {};
}
var roleRepairer = new Role();

roleRepairer.getLastRepairTarget = function getLastRepairTarget(obj) {
    var log = logger.getLogger('RoleRepair');
    var result;
    var delList = {};

    for (var s in Memory.repairing) {
        var objID = Memory.repairing[s];
        // Flag dead creeps for removal from memory
        if (Game.getObjectById(objID) === null) {
            delList[s] = true;
        }

        if (objID === obj.id) {
            result = Game.getObjectById(s);
            break;
        } else {
            result = false;
        }
    }

    for (var c in delList) {
        log.debug(`Cleaning node ${c} from repair memory.`);
        delete Memory.repairing[c];
    }

    return result;
};

roleRepairer.getUntargetedStructures = function getUntargetedStructures(obj, filter) {
    filter = (typeof filter !== 'undefined') ? filter : {
        filter: (structure) => {
            var repairing = Memory.repairing[structure.id];

            if (structure.hits == structure.hitsMax) {
                return false;
            }

            if (repairing && repairing === obj.id) {
                return true;
            } else if (repairing && repairing !== obj.id) {
                return false;
            } else {
                return true;
            }
        }
    };

    // Get sources that are not being targeted by other repairers
    var structures = obj.room.find(FIND_STRUCTURES, filter);
    structures.sort((a, b) => a.hits - b.hits);
    return structures;
};

roleRepairer.run = function run(creep) {
    var log = logger.getLogger('RoleRepair');

    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.totalCarry == creep.carryCapacity) {
        creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
        untargetedStructures = this.getUntargetedStructures(creep);
        var repairTarget;
        if (creep.memory.repairTarget) {
            repairTarget = Game.getObjectById(creep.memory.repairTarget);
            creep.memory.repairTime += 1; // Count for each interval that a unit is repairing

            var hitPcnt = repairTarget.hits / repairTarget.hitsMax;
            // Repair structures to at least 25% or 200 ticks
            if (repairTarget.hits === repairTarget.hitsMax || creep.memory.repairTime >= 200) {
                delete Memory.repairing[repairTarget.id];
                creep.memory.repairTime = 0;
                if (untargetedStructures[0]) {
                    log.debug(`${creep.name} changed from ${repairTarget.id}(${hitPcnt}) to ${untargetedStructures[0].id}(${untargetedStructures[0].hits / untargetedStructures[0].hitsMax})`);
                    // Set new repairTarget
                    repairTarget = untargetedStructures[0];
                    creep.memory.repairTarget = repairTarget.id;
                    Memory.repairing[repairTarget.id] = creep.id;
                }
            }
        } else {
            if (untargetedStructures[0]) {
                repairTarget = untargetedStructures[0];
                creep.memory.repairTarget = repairTarget.id;
                Memory.repairing[repairTarget.id] = creep.id;
                log.debug(`${creep.name} set new target ${repairTarget.id}`);
            }
        }

        if (repairTarget) {
            creep.repair_move(repairTarget);
        } else {
            roleBuilder.run(creep);
        }
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
};

roleRepairer.onDeath = function onDeath(name) {
    var log = logger.getLogger('RoleRepair');
    var repId = Memory.creeps[name].repairTarget;
    delete Memory.repairing[repId];
    log.debug(`Removed node ${repId} from repair memory.`);
};

roleRepairer.icon = "🔧";

module.exports = roleRepairer;
