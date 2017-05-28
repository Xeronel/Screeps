require('creep.proto');
var popManager = require('population.manager');
var memManager = require('memory.manager');
var population = require('population');
var $ = require('utils');
var logger = require('logger');
var config = require('config');

var log = logger.getLogger();
log.setLevel(config.logLevel);

module.exports.loop = function () {
    // Remove dead creeps from memory
    memManager.cleanCreeps();

    // Creep Spawner
    popManager.spawnCreeps();

    $(Game.spawns).each((s) => {
        $(Game.spawns[s].room.find(FIND_MY_CREEPS)).each((creep) => {
            if (population.hasOwnProperty(creep.memory.role)) {
                population[creep.memory.role].role.run(creep);
                population[creep.memory.role].role.draw(creep);
            } else {
                console.log('Error running creep ' + creep.name + ' Memory: ' + JSON.stringify(creep.memory));
            }
        });
    });
}
