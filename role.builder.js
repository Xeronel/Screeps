var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleBuilder = new Role();
roleBuilder.parts = [MOVE, CARRY, WORK, WORK, WORK];
roleBuilder.run = function (creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('🚧 build');
    }

    if (creep.memory.building) {
        var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets, {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
        } else {
            roleUpgrader.run(creep);
        }
    } else {
        var sources = creep.pos.findClosestByRange(FIND_SOURCES);
        if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        }
    }
}

module.exports = roleBuilder;
