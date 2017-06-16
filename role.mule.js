var Role = require('role.proto');
var logger = require('logger');

if (Memory.muleTargets === undefined) {
    Memory.muleTargets = {};
}
var roleMule = new Role();
roleMule.log = logger.getLogger('RoleMule');

roleMule.getuntargetedStructure = function getuntargetedStructure(obj, filter) {
    filter = (typeof filter !== 'undefined') ? filter : {
        filter: (s) => {
            var targeted = Memory.muleTargets[s.id];
            if (targeted && targeted !== obj.id) {
                return false;
            } else if ((s.structureType === STRUCTURE_TOWER ||
                    s.structureType === STRUCTURE_EXTENSION ||
                    s.structureType === STRUCTURE_SPAWN) &&
                s.energy < s.energyCapacity) {
                return true;
            } else if (targeted && targeted === obj.id) {
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
    var totalCarry = creep.totalCarry;
    var target;
    var untargetedStructure;

    if (creep.carry.energy == 0) {
        creep.memory.collecting = true;
    }
    if (creep.totalCarry == creep.carryCapacity) {
        creep.memory.collecting = false;
    }

    if (!creep.memory.collecting) {
        if (creep.memory.muleTarget) {
            target = Game.getObjectById(creep.memory.muleTarget);
            if (target.energy === target.energyCapacity) {
                untargetedStructure = this.getuntargetedStructure(creep);
                delete Memory.muleTargets[creep.memory.muleTarget];
                delete creep.memory.muleTarget;
                this.log.debug(`Deleted ${target.id}[${target.energy}/${target.energyCapacity}] from muleTargets`);
                if (untargetedStructure) {
                    this.log.debug(`${creep.name} changed from ${target.id}[${target.energy}/${target.energyCapacity}] to ${untargetedStructure.id}[${untargetedStructure.energy}/${untargetedStructure.energyCapacity}]`);
                    // Set new mule target
                    target = untargetedStructure;
                    creep.memory.muleTarget = target.id;
                    Memory.muleTargets[creep.memory.muleTarget];
                }
            }
        } else {
            untargetedStructure = this.getuntargetedStructure(creep);
            if (untargetedStructure) {
                // Set new mule target
                target = untargetedStructure;
                creep.memory.muleTarget = target.id;
                Memory.muleTargets[target.id] = creep.id;
                this.log.debug(`${creep.name} got new target ${target.id}[${target.energy}/${target.energyCapacity}]`);
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
