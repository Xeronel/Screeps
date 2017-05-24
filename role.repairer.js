var roleBuilder = require('role.builder');
var Role = require('role.proto');
var $ = require('utils');

var roleRepairer = new Role();
roleRepairer.repairing = {}; // Store repair targets
roleRepairer.run = function (creep) {
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
                if (structure.hits == structure.hitsMax) {
                    return false;
                }
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
            //count for each interval that a unit is repairing
            creep.memory.repairTime += 1;
            var hitPcnt = structure.hits / structure.hitsMax;
            // Repair structures to at least 25%
            if (structure.hits === structure.hitsMax || creep.memory.repairTime >= 200) {
                console.log(creep.name + ' changed from ' + structure.id + '(' + hitPcnt + ') to ' + structures[0].id + '(' + structures[0].hits / structures[0].hitsMax + ')');
                delete this.repairing[structure.id];
                //console.log(creep.name  + " " + creep.memory.repairTime);
                structure = structures[0];
                creep.memory.repairTime = 0;
                this.repairing[structure.id] = creep.name;
            }
        } else if (!structure){
            structure = structures[0];
            console.log(creep.name + ' set new target ' + structure.id);
            this.repairing[structure.id] = creep.name;
        }

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
