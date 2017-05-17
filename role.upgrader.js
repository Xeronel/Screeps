var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('🚧 upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
            }
        }
        else {
            var cSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(cSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(cSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	},
    parts: [MOVE, CARRY, CARRY, WORK]
};

module.exports = roleUpgrader;
