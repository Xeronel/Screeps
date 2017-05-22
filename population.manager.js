var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var population = require('population');
var $ = require('utils');

var populationManager = {};
populationManager.spawnCreeps = function () {
    $(Game.spawns).each(function (spawnName) {
        var spawn = Game.spawns[spawnName];
        var roomPopulation = spawn.room.find(FIND_MY_CREEPS);

        $(population).each(function (role) {
            var creepType = population[role];
            var rolePopulation = _.filter(
                roomPopulation,
                (creep) => creep.memory.role == role
            );
            if (rolePopulation.length < creepType.qty(spawn.room)) {
                var newName = spawn.createCreep(
                    creepType.parts,
                    undefined, {
                        role: role
                    }
                );
                if (newName !== ERR_NOT_ENOUGH_RESOURCES && newName !== ERR_BUSY) {
                    console.log('Spawning ' + role + ': ' + newName);
                }
            }
        });
    });
}

module.exports = populationManager;
