var roleBuilder = require('role.builder');
var Role = require('role.proto');

var roleRepairer = new Role();
roleRepairer.parts = [MOVE, MOVE, CARRY, WORK, WORK];
roleRepairer.run = function (creep) {
    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
        creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
        var structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (obj) {
                return obj.hits < 20000 && obj.hits / obj.hitsMax <= 0.5;
            }
        });
        if (structures) {
            creep.repair_move(structures);
        } else {
            roleBuilder.run(creep);
        }
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
}

module.exports = roleRepairer;
