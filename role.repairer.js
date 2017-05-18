var roleBuilder = require('role.builder');
var Role = require('role.proto');

var roleRepairer = new Role();
roleRepairer.parts = [MOVE, CARRY, WORK];
roleRepairer.run = function (creep) {
    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
        creep.memory.repairing = true;
        creep.say('🚧 repairing');
    }

    if (creep.memory.repairing) {
        var structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (obj) {
                return obj.hits < 20000 && obj.hits / obj.hitsMax <= 0.5;
            }
        });
        if (structures) {
            if (creep.repair(structures) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structures, {
                    visualizePathStyle: {
                        stroke: '#B42929'
                    }
                });
            }
        } else {
            roleBuilder.run(creep);
        }
    } else {
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);
        creep.harvest_move(sources);
    }
}

module.exports = roleRepairer;
