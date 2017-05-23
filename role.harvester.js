var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleHarvester = new Role();
roleHarvester.run = function (creep) {
    var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_STORAGE && s.store.energy < s.storeCapacity
    });
    var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
    });

    // If creep isn't carrying max capacity, harvest
    if (creep.carry.energy < creep.carryCapacity) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES) ||
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

module.exports = roleHarvester;
