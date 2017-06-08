require('creep.proto');
require('spawn.proto');
var config = require('config');
var logger = require('logger');
var popManager = require('population.manager');
var memManager = require('memory.manager');
var struManager = require('structure.manager')
var population = require('population');
var $ = require('utils');

// Setup log
var log = logger.getLogger();
log.setLevel(config.logLevel);

module.exports.loop = function main() {
    // Remove dead creeps from memory
    memManager.cleanCreeps();

    // Creep Spawner
    popManager.spawnCreeps();

    $(Game.spawns).each((s) => {
        var spawn = Game.spawns[s];
        
        // Manage the Structures
        struManager.run(spawn.room);

        // Run all creep roles
        $(spawn.room.find(FIND_MY_CREEPS)).each((creep) => {
            if (population.hasOwnProperty(creep.memory.role)) {
                population[creep.memory.role].role.run(creep, spawn);
            } else {
                log.warn(`Error running creep ${creep.name}, Memory: ${JSON.stringify(creep.memory)}`);
            }
        });
    });
}
