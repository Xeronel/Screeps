var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');

var roleHarvester = new Role();
roleHarvester.run = function(creep) {
    var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(obj) {
            return obj.energy < obj.energyCapacity;
        }
    });
    if (creep.carry.energy < creep.carryCapacity && structure) {
        var cSource = creep.pos.findClosestByPath(FIND_SOURCES) ||
            creep.pos.findClosestByRange(FIND_SOURCES);
        var ESource = creep.pos.findClosestByPath(FIND_SOURCES);

        if (creep.pickup(cSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(cSource, {     
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        } else {
            creep.harvest_move(ESource);
        }
    } else if (structure) {
        creep.transfer_move(structure);
    } else {
        roleUpgrader.run(creep);
    }
};

module.exports = roleHarvester;
