var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleHarvester = new Role();
roleHarvester.run = function (creep) {
    var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (obj) {
            return obj.energy < obj.energyCapacity;
        }
    });
    if (creep.carry.energy < creep.carryCapacity && structure) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES) ||
            creep.pos.findClosestByPath(FIND_SOURCES, {
                ignoreCreeps: true
            });

        if (source) {
            creep.harvest_move(source);
        }
    } else if (structure) {
        creep.transfer_move(structure);
    } else {
        roleUpgrader.run(creep);
    }
};

module.exports = roleHarvester;
