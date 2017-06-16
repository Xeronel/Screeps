var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleHarvester = new Role();
roleHarvester.run = function run(creep) {
    if (creep.carry.energy == 0) {
        creep.memory.collecting = true;
    }
    if (creep.totalCarry == creep.carryCapacity) {
        creep.memory.collecting = false;
    }

    // If creep isn't carrying max capacity, harvest
    if (creep.memory.collecting) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (s) => s.energy > 0
            }) ||
            creep.pos.findClosestByPath(FIND_SOURCES, {
                ignoreCreeps: true
            });
        if (source) {
            creep.harvest_move(source);
        }
    } else {
        var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => {
                if (s.structureType === STRUCTURE_STORAGE) {
                    if (s.store.energy < s.storeCapacity) {
                        return true;
                    }
                } else if (s.structureType === STRUCTURE_EXTENSION) {
                    if (s.energy < s.energyCapacity) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        });
        if (storage) {
            creep.transfer_move(storage);
        } else {
            roleUpgrader.run(creep);
        }
    }
};
roleHarvester.icon = "⛏";

module.exports = roleHarvester;
