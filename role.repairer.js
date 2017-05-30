var roleBuilder = require('role.builder');
var Role = require('role.proto');
var $ = require('utils');
var logger = require('logger');

var roleRepairer = new Role();

function getLastRepairTarget(creep) {
    var log = logger.getLogger('RoleRepair');
    var result;
    var delList = {};

    for (var s in Memory.repairing) {
        var creepName = Memory.repairing[s];
        // Flag dead creeps for removal from memory
        if (Game.creeps[creepName] === undefined) {
            delList[s] = true;
        }

        if (creepName === creep.name) {
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
}

function getUntargedStructures(creep) {
    // Get sources that are not being targeted by other repairers
    var structures = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            var repairing = Memory.repairing[structure.id];
            if (structure.hits == structure.hitsMax) {
                return false;
            }
            if (repairing && repairing === creep.name) {
                return true;
            } else if (repairing && repairing !== creep.name) {
                return false;
            } else {
                return true;
            }
        }
    });
    structures.sort((a, b) => a.hits - b.hits);
    return structures;
}

roleRepairer.run = function run(creep) {
    var log = logger.getLogger('RoleRepair');
    var repairTarget;

    if (Memory.repairing === undefined) {
        Memory.repairing = {};
    }
    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
        creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
        repairTarget = getLastRepairTarget(creep);
        untargetedStructures = getUntargedStructures(creep);

        if (repairTarget) {
            //count for each interval that a unit is repairing
            creep.memory.repairTime += 1;
            var hitPcnt = repairTarget.hits / repairTarget.hitsMax;
            // Repair structures to at least 25% or 200 ticks
            if (repairTarget.hits === repairTarget.hitsMax || creep.memory.repairTime >= 200) {
                delete Memory.repairing[repairTarget.id];
                creep.memory.repairTime = 0;
                if (untargetedStructures[0]) {
                    log.debug(`${creep.name} changed from ${repairTarget.id}(${hitPcnt}) to ${untargetedStructures[0].id}( ${untargetedStructures[0].hits / untargetedStructures[0].hitsMax})`);
                    repairTarget = untargetedStructures[0];
                    Memory.repairing[repairTarget.id] = creep.name;
                }
            }
        } else {
            if (untargetedStructures[0]) {
                repairTarget = untargetedStructures[0];
                Memory.repairing[repairTarget.id] = creep.name;
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
}

module.exports = roleRepairer;
