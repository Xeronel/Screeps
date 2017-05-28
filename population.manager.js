var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var population = require('population');
var $ = require('utils');
var logger = require('logger');

var populationManager = {};
populationManager.spawnCreeps = function () {
    var log = logger.getLogger('PopMan');

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
                // Calculates cost available unit
                var finalParts;
                for (var i in creepType.parts) {
                    parts = creepType.parts[i];
                    var partcost = $(parts).partCost();
                    if ((partcost / spawn.room.energyAvailable) <= 0.75 || partcost === 300) {
                        finalParts = parts;
                        break;
                    }
                }

                if (finalParts) {
                    // Spawns a new Unit
                    var newName = spawn.createCreep(
                        finalParts,
                        undefined, {
                            role: role
                        }
                    );
                    if (newName !== ERR_NOT_ENOUGH_RESOURCES && newName !== ERR_BUSY) {
                        log.info('Spawning ' + role + ': ' + newName + ' ' + finalParts + ' ' + $(finalParts).partCost());
                    }
                }
            }
        });
    });
}

module.exports = populationManager;
