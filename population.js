var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var population = {
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
};

population.spawnCreeps = function () {
    Object.getOwnPropertyNames(population).forEach(function (role) {
        if (role !== 'spawnCreeps') {
            var creepType = population[role];
            var rolePopulation = _.filter(Game.creeps, (creep) => creep.memory.role == role);

            if (rolePopulation.length < creepType.qty) {
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
        }
    });
}

module.exports = population;
