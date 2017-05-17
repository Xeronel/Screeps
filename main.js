var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var memManager = require('memory.manager');

module.exports.loop = function () {
    var roles = {
        'harvester': {
            qty: 3,
            role: roleHarvester
        },
        'upgrader': {
            qty: 2,
            role: roleUpgrader
        },
        'builder': {
            qty: 3,
            role: roleBuilder
        }
    }

    // Remove dead creeps from memory
    memManager.cleanCreeps();

    // Creep Spawner
    Object.getOwnPropertyNames(roles).forEach(function (role) {
        var creepType = roles[role];
        var population = _.filter(Game.creeps, (creep) => creep.memory.role == role);

        if (population.length < creepType.qty) {
            var newName = Game.spawns['Spawn1'].createCreep(
                creepType.role.parts,
                undefined, {
                    role: role
                }
            );
            if (newName !== ERR_NOT_ENOUGH_RESOURCES && newName !== ERR_BUSY) {
                console.log('Spawned ' + role + ': ' + newName);
            }
        }
    });

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (roles.hasOwnProperty(creep.memory.role)) {
            roles[creep.memory.role].role.run(creep);
            roles[creep.memory.role].role.draw(creep);
        } else {
            console.log('Role: ' + creep.memory.role + ' is not in role list.');
        }
    }
}
