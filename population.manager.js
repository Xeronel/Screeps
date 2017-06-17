var population = require('population');
var $ = require('utils');
var logger = require('logger');
var config = require('config');

if (Memory.lastSpawnTime === undefined) {
    Memory.lastSpawnTime = Game.time;
}

var populationManager = {};
populationManager.spawnCreeps = function spawnCreeps() {
    var log = logger.getLogger('PopMan');
    $(Game.spawns).each(function spawnLoop(spawn) {
        var roomPopulation = spawn.room.find(FIND_MY_CREEPS);

        $(population).each(function popLoop(popObj, roleName) {
            var creepType = population[roleName];
            var rolePopulation = _.filter(
                roomPopulation,
                (creep) => creep.memory.role == roleName
            );
            if (Game.time - Memory.lastSpawnTime >= config.spawn.time) {
                log.debug(`role ${roleName} wants ${creepType.qtyFnc(spawn.room)} spawns`);
                if (rolePopulation.length < creepType.qtyFnc(spawn.room)) {
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

                    if (finalParts) {
                        log.debug(`Trying to spawn ${roleName} ${finalParts} ${partcost}`);
                        // Spawns a new Unit
                        var newName = spawn.createRole(roleName, finalParts, creepType.role.icon);
                        if (newName == ERR_NOT_ENOUGH_RESOURCES) {
                            log.debug(`Not enough energy to spawn ${roleName} (${spawn.room.energyAvailable}/${partcost})`);
                        }
                        if (newName !== ERR_NOT_ENOUGH_RESOURCES && newName !== ERR_BUSY) {
                            log.debug(`Spawning with time between last spawn = ${Game.time - Memory.lastSpawnTime}`);
                            log.info(`Spawning ${roleName}: ${newName} [${finalParts}] (${partcost}/${spawn.room.energyAvailable})`);
                            Memory.lastSpawnTime = Game.time;
                        }
                    }
                }
            }
        });
    });
};

populationManager.runCreeps = function runCreeps() {
    var log = logger.getLogger('PopMan');
    for (creepName in Game.creeps) {
        var creep = Game.creeps[creepName];
        if (population.hasOwnProperty(creep.memory.role)) {
            population[creep.memory.role].role.run(creep)
        } else {
            log.warn(`Error running creep ${creep.name}, Memory: ${JSON.stringify(creep.memory)}`);
        }
    }
};

module.exports = populationManager;
