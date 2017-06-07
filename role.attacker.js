var roleDefender = require('role.defender');
var Role = require('role.proto');
var logger = require('logger');

var roleAttacker = new Role();

roleAttacker.run = function run(creep, spawn) {
    var log = logger.getLogger('RoleAttacker');
    var flag = creep.pos.findClosestByPath(FIND_FLAGS);
    var attackers = creep.find(FIND_CREEPS, {
        filter: (s) => creep.memory.role === roleAttacker
    }).length;

    if (attackers > 0) {
        if (Memory.attacking === undefined) {
            Memory.attacking = {};
        }
        if (!creep.memory.attacking && creep.pos === flag.pos) {
            creep.memory.attacking = true;
        } else {
            creep.memory.attacking = false;
            creep.moveTo(flag);
        }

        if(creep.memory.attacking){
            var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            // If an enemy exists, try to attack it
            if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy);
            }
            if (creep.Attack(enemy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy);
            }
        }


    } else {
        // Fall back to upgrader
        roleDefender.run(creep);
    }
}

module.exports = roleAttacker;
