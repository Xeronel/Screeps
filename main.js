require('creep.proto');
var config = require('config');
var logger = require('logger');
var popManager = require('population.manager');
var memManager = require('memory.manager');
var population = require('population');
var $ = require('utils');

var log = logger.getLogger();
log.setLevel(config.logLevel);

module.exports.loop = function main() {
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
                log.warn('Error running creep ' + creep.name + ' Memory: ' + JSON.stringify(creep.memory));
            }
        });
    });
}
