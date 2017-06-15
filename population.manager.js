var population = require('population');
var $ = require('utils');
var logger = require('logger');
var config = require('config');

if (Memory.LspawnTime === undefined)
{
    Memory.LspawnTime = Game.time;
}

var populationManager = {};
populationManager.spawnCreeps = function spawnCreeps() {
    var log = logger.getLogger('PopMan');
    $(Game.spawns).each(function spawnLoop(spawnName) {
        var spawn = Game.spawns[spawnName];
        var roomPopulation = spawn.room.find(FIND_MY_CREEPS);

        $(population).each(function popLoop(role) {
            var creepType = population[role];
            var rolePopulation = _.filter(
                roomPopulation,
                (creep) => creep.memory.role == role
            );
            if (Game.time - Memory.LspawnTime >= config.spawn.time) {
                if (rolePopulation.length < creepType.qty(spawn.room)) {
                    // Calculates cost available unit
                    var finalParts;
                    var partcost;
                    for (var i = 0; i < creepType.parts.length; i++) {
                        parts = creepType.parts[i];
                        partcost = $(parts).partCost();
                        if ((partcost / spawn.room.energyAvailable) <= config.spawn.maxEnergyPercent || partcost === 200) {
                            finalParts = parts;
                            break;
                        }
                    }

                    if(finalParts) {
                        log.debug(`Trying to spawn ${role} ${finalParts} ${partcost}`);
                        // Spawns a new Unit
                        var newName = spawn.createRole(role, finalParts, creepType.role.icon);
                        if (newName == ERR_NOT_ENOUGH_RESOURCES) {
                            log.debug(`Not enough energy to spawn ${role} (${spawn.room.energyAvailable}/${partcost})`);
                        }
                        if (newName !== ERR_NOT_ENOUGH_RESOURCES && newName !== ERR_BUSY) {
                            log.debug(`Spawning with time between last spawn = ${Game.time - Memory.LspawnTime}`);
                            log.info(`Spawning ${role}: ${newName} [${finalParts}] (${partcost}/${spawn.room.energyAvailable})`);
                            Memory.LspawnTime = Game.time;
                        }
                    }
                }
            }
        });
    });
}

module.exports = populationManager;
