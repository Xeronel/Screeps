var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');

var roleDefender = new Role();
roleDefender.log = logger.getLogger('RoleDefender');

roleDefender.run = function run(creep) {
    var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

    if (enemy) {
        // If an enemy exists, try to attack it
        if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    } else {
        var spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_SPAWN
            }
        });
        // Kill itself LOL what a noob
        if (spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            this.log.info(`${creep.name} killed himself.`);
            creep.moveTo(spawn);
        }
    }
};

roleDefender.icon = "🛡";

module.exports = roleDefender;
