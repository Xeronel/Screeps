var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');

var roleDefender = new Role();

function getAndTransfer(creep, target) {
    if (creep.carry.energy < creep.carryCapacity) {
        creep.obtainClosestSource(creep.findClosestSource());
    } else {
        creep.transfer_move(target);
    }
}

roleDefender.run = function run(creep, spawn) {
    var log = logger.getLogger('RoleDefender');
    var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity
    });

    if (enemy) {
        // If an enemy exists, try to attack it
        if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemy);
        }
    } else if (tower) {
        // If a tower exists try to fill it with energy
        getAndTransfer(creep, tower);
    } else if (spawn.energy < spawn.energyCapacity) {
        getAndTransfer(creep, spawn);
    } else {
        // Fall back to upgrader
        roleUpgrader.run(creep);
    }
}

module.exports = roleDefender;
