var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleBuilder = new Role();
roleBuilder.parts = [MOVE, MOVE, CARRY, WORK, WORK];
roleBuilder.run = function (creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
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
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);
        creep.harvest_move(sources);
    }
}

module.exports = roleBuilder;
