var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleBuilder = new Role();
roleBuilder.run = function run(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
    }
    if (!creep.memory.building && _.sum(creep.carry) == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if (creep.memory.building) {
        var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (targets) {
            creep.build_move(targets);
        } else {
            roleUpgrader.run(creep);
        }
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
};

roleBuilder.icon = "🔨";

module.exports = roleBuilder;
