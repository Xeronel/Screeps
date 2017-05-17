var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy == 0) {
            var cSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(cSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(cSource, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	},
    parts: [MOVE, CARRY, WORK]
};

module.exports = roleUpgrader;
