var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleHarvester = new Role();
roleHarvester.parts = [MOVE, CARRY, WORK, WORK]; // Cost 300
roleHarvester.run = function (creep) {
    var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (obj) {
            return obj.energy < obj.energyCapacity;
        }
    });
    if (creep.carry.energy < creep.carryCapacity && structure) {
        var cSource = creep.pos.findClosestByPath(FIND_SOURCES) ||
            creep.pos.findClosestByRange(FIND_SOURCES);
        creep.harvest_move(cSource);
    } else if (structure) {
        creep.transfer_move(structure);
    } else {
        roleUpgrader.run(creep);
    }
};

module.exports = roleHarvester;
