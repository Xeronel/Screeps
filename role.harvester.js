var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleHarvester = new Role();
roleHarvester.parts = [MOVE, CARRY, CARRY, WORK, WORK];
roleHarvester.run = function (creep) {
    var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (obj) {
            return obj.energy < obj.energyCapacity;
        }
    });
    if (creep.carry.energy < creep.carryCapacity && structure) {
        var cSource = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(cSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(cSource, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        }
    } else if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }
    } else {
        roleUpgrader.run(creep);
    }
};

module.exports = roleHarvester;
