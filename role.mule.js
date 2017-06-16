var Role = require('role.proto');
var logger = require('logger');

if (Memory.muleTargets == undefined) {
    Memory.muleTargets = {};
}
var roleMule = new Role();

roleMule.getUntargetedStructures = function getUntargetedStructures(obj, filter) {
    filter = (typeof filter !== 'undefined') ? filter : {
        filter: (s) => {
            var targeted = Memory.muleTargets[s.id];
            if (targeted && targeted === obj.id) {
                return true;
            } else if (targeted && targeted !== obj.id) {
                return false;
            } else if ((s.structureType === STRUCTURE_TOWER ||
                    s.structureType === STRUCTURE_EXTENSION ||
                    s.structureType === STRUCTURE_SPAWN) &&
                s.energy < s.energyCapacity) {
                return true;
            } else {
                return false;
            }
        }
    };

    // Get sources that are not being targeted by other repairers
    var structures = obj.pos.findClosestByPath(FIND_MY_STRUCTURES, filter);
    return structures;
};

roleMule.run = function run(creep) {
    var log = logger.getLogger('RoleMule');
    var totalCarry = creep.totalCarry;
    var target;

    if (creep.carry.energy == 0) {
        creep.memory.collecting = true;
    }
    if (creep.totalCarry == creep.carryCapacity) {
        creep.memory.collecting = false;
    }

    if (!creep.memory.collecting) {
        if (creep.memory.repairTarget) {
            target = Game.getObjectById(creep.memory.repairTarget);
            if (target.energy === target.energyCapacity) {
                log.debug(`Deleted ${target}[${target.energy}/${target.energyCapacity}] from muleTargets`);
                delete Memory.muleTargets[creep.memory.repairTarget];
                target = this.getUntargetedStructures(creep);
                if (target) {
                    creep.memory.repairTarget = target.id;
                }
            }
        } else {
            target = this.getUntargetedStructures(creep);
            if (target) {
                creep.memory.repairTarget = target.id;
                Memory.muleTargets[target.id] = creep.id;
                log.debug(`${creep.name} got new target ${target.id}`);
            }
        }
        // If a tower exists try to fill it with energy
        creep.transfer_move(target);
    } else if (creep.memory.collecting) {
        var dropE = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: {
                resourceType: RESOURCE_ENERGY
            }
        });
        if (dropE) {
            creep.obtainClosestSource(dropE);
        } else {
            creep.obtainClosestSource(creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType === STRUCTURE_STORAGE)
            }));
        }
    }
};

roleMule.onDeath = function onDeath(name) {
    var targetId = Memory.creeps[name].repairTarget;
    delete Memory.muleTargets[targetId];
};

roleMule.icon = "🐎";

module.exports = roleMule;
