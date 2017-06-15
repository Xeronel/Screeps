var roleDefender = require('role.defender');
var Role = require('role.proto');
var logger = require('logger');

var roleAttacker = new Role();

roleAttacker.run = function run(creep) {
    var log = logger.getLogger('RoleAttacker');
    var flags = _.filter(Game.flags, {color: COLOR_RED});
    var roomsExit = creep.room.find(Game.map.findExit(creep.room, flags[0].room))
    var attackers = creep.find(FIND_CREEPS, {
        filter: (s) => creep.memory.role === roleAttacker
    }).length;
    if(!creep.room.inRangeTo(roomsExit) && attackers <= 4)
    {
        creep.moveTo(roomsExit);
    }
    if (attackers > 4) {
        if (!creep.memory.attacking && creep.pos === flags[0].pos) {
            creep.memory.attacking = true;
        } else {
            creep.memory.attacking = false;
            creep.moveTo(flag[0]);
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
};

roleAttacker.icon = "⚔";

module.exports = roleAttacker;
