var roleBuilder = require('role.builder');
var Role = require('role.proto');
var $ = require('utils');

var roleRepairer = new Role();
roleRepairer.repairing = {}; // Store repair targets
roleRepairer.run = function(creep) {
    if (creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
        creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
        var structure = null;
        $(this.repairing).each((s) => {
            if (this.repairing[s] === creep.name) {
                structure = Game.getObjectById(s);
            }
            if (!Game.creeps[creep.name]) {
                delete this.repairing[s];
            }
        });

        // Get sources that are not being targeted by other repairers
        var structures = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                var repairing = this.repairing[structure.id];
                if (repairing && repairing === creep.name) {
                    return true;
                } else if (repairing && repairing !== creep.name) {
                    return false;
                } else {
                    return true;
                }
            }
        });
        structures.sort((a, b) => a.hits - b.hits);

        if (structure) {
            var hitPcnt = structure.hits / structure.hitsMax;
            // Repair structures to at least 25%
            if (structure.id !== structures[0].id && hitPcnt >= 0.25) {
                delete this.repairing[structure.id];
                structure = structures[0];
            }
        } else {
            structure = structures[0];
        }
        this.repairing[structure.id] = creep.name;

        if (structure) {
            creep.repair_move(structure);
        } else {
            roleBuilder.run(creep);
        }
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
}

module.exports = roleRepairer;
