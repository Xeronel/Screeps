var Role = require('role.proto');
var roleUpgrader = new Role();

roleUpgrader.parts = [MOVE, MOVE, CARRY, CARRY, WORK];
roleUpgrader.run = function (creep) {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
    }

    if (creep.memory.upgrading) {
        creep.upgrade_move();
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
};

module.exports = roleUpgrader;
