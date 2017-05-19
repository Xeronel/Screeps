var roleBuilder = require('role.builder');
var Role = require('role.proto');

var roleRepairer = new Role();
roleRepairer.run = function(creep) {
    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
        creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
        var structures = creep.pos.find(FIND_STRUCTURES)
        structures.sort(function(a, b) {
            return a.hits - b.hits;
        });
        if (structures[0]) {
            creep.repair_move(structures[0]);
        } else {
            roleBuilder.run(creep);
        }
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
}

module.exports = roleRepairer;
