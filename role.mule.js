var Role = require('role.proto');
var logger = require('logger');

if (Memory.mule_targets == undefined) {
    Memory.mule_targets = {};
}
var roleMule = new Role();

roleMule.getLastTarget = function getLastRepairTarget(obj) {
    var log = logger.getLogger('RoleMule');
    var result;
    var delList = {};

    for (var s in Memory.mule_targets) {
        var objID = Memory.mule_targets[s];
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
        log.debug(`Cleaning node ${c} from mule target memory.`);
        delete Memory.mule_targets[c];
    }

    return result;
};

roleMule.getUntargetedStructures = function getUntargetedStructures(obj, filter) {
    filter = (typeof filter !== 'undefined') ? filter : {
        filter: (s) => {
            var targeted = Memory.mule_targets[s.id];
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

roleMule.run = function run(creep, spawn) {
    var log = logger.getLogger('RoleMule', logger.DEBUG);
    var totalCarry = creep.totalCarry;
    var target;

    if (creep.carry.energy == 0) {
        creep.memory.collecting = true;
    }
    if (creep.totalCarry == creep.carryCapacity) {
        creep.memory.collecting = false;
    }

    if (!creep.memory.collecting) {
        target = this.getLastTarget(creep);
        if (target) {
            if (target.energy === target.energyCapacity) {
                log.debug(`Deleted ${target.id}[${target.energy}/${target.energyCapacity}] from mule_targets`);
                delete Memory.mule_targets[target.id];
            }
            target = this.getUntargetedStructures(creep);
        } else {
             target = this.getUntargetedStructures(creep);
             if (target) {
                 Memory.mule_targets[target.id] = creep.id;
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

roleMule.icon = "🐎";

module.exports = roleMule;
