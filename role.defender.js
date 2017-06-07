var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');

var roleDefender = new Role();

roleDefender.run = function run(creep, spawn) {
    var log = logger.getLogger('RoleDefender');
    var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

    if (enemy) {
        // If an enemy exists, try to attack it
        if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    } else {
        // Fall back to upgrader
        roleUpgrader.run(creep);
    }
}

module.exports = roleDefender;
