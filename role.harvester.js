var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleHarvester = new Role();
roleHarvester.run = function run(creep) {
    var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
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
    var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
    });

    // If creep isn't carrying max capacity, harvest
    if (creep.totalCarry < creep.carryCapacity) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (s) => s.energy > 0
            }) ||
            creep.pos.findClosestByPath(FIND_SOURCES, {
                ignoreCreeps: true
            });
        if (source) {
            creep.harvest_move(source);
        }
    } else if (structure) {
        creep.transfer_move(structure);
    } else if (storage) {
        creep.transfer_move(storage);
    } else {
        roleUpgrader.run(creep);
    }
};

roleHarvester.icon = "⛏";

module.exports = roleHarvester;
