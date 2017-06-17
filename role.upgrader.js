const profiler = require('screeps-profiler');
var Role = require('role.proto');

var roleUpgrader = new Role();
roleUpgrader.run = function run(creep) {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
    }
    if (!creep.memory.upgrading && creep.totalCarry == creep.carryCapacity) {
        creep.memory.upgrading = true;
    }

    if (creep.memory.upgrading) {
        creep.upgrade_move();
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
};

roleUpgrader.icon = "🛠";
profiler.registerClass(roleUpgrader, 'roleUpgrader');
module.exports = roleUpgrader;
