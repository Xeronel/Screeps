var roleBuilder = require('role.builder');
var config = require('config')
var Role = require('role.proto');
var $ = require('utils');
var logger = require('logger');
const profiler = require('screeps-profiler');

if (Memory.repairing == undefined) {
    Memory.repairing = {};
}
var roleRepairer = new Role();
roleRepairer.log = logger.getLogger('RoleRepair');

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
    var repairTarget;

    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.totalCarry == creep.carryCapacity) {
        creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
        if (creep.memory.repairTarget) {
            repairTarget = Game.getObjectById(creep.memory.repairTarget);
            creep.memory.repairTime += 1; // Count for each interval that a unit is repairing

            var hitPcnt = repairTarget.hits / repairTarget.hitsMax;
            // Repair structures to at least 25% or 200 ticks
            if (repairTarget.hits === repairTarget.hitsMax || creep.memory.repairTime >= config.repair.maxRepairTime) {
                delete Memory.repairing[repairTarget.id];
                delete Memory.repairTarget;
                creep.memory.repairTime = 0;
                untargetedStructures = this.getUntargetedStructures(creep);
                if (untargetedStructures[0]) {
                    this.log.debug(`${creep.name} changed from ${repairTarget.id}(${hitPcnt}) to ${untargetedStructures[0].id}(${untargetedStructures[0].hits / untargetedStructures[0].hitsMax})`);
                    // Set new repairTarget
                    repairTarget = untargetedStructures[0];
                    creep.memory.repairTarget = repairTarget.id;
                    Memory.repairing[repairTarget.id] = creep.id;
                }
            }
        } else {
            untargetedStructures = this.getUntargetedStructures(creep);
            if (untargetedStructures[0]) {
                repairTarget = untargetedStructures[0];
                creep.memory.repairTarget = repairTarget.id;
                Memory.repairing[repairTarget.id] = creep.id;
                this.log.debug(`${creep.name} set new target ${repairTarget.id}`);
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
    var repId = Memory.creeps[name].repairTarget;
    delete Memory.repairing[repId];
    this.log.debug(`Removed node ${repId} from repair memory.`);
};

roleRepairer.icon = "🔧";

profiler.registerClass(roleRepairer, 'roleRepairer');

module.exports = roleRepairer;
