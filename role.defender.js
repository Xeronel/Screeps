var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');

var roleDefender = new Role();
roleDefender.run = function run(creep) {
    var log = logger.getLogger('RoleDefender');
    var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (enemy) {
        if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    } else {
        roleUpgrader.run(creep);
    }
}

module.exports = roleDefender;
