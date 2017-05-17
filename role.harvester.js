var roleUpgrader = require('role.upgrader');

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity && Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
            var cSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(cSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(cSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else if(Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            roleUpgrader.run(creep);
        }
	},
    parts: [MOVE, CARRY, CARRY, WORK]
};

module.exports = roleHarvester;
