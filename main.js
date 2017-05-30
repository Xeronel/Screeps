require('creep.proto');
var config = require('config');
var logger = require('logger');
var popManager = require('population.manager');
var memManager = require('memory.manager');
var population = require('population');
var $ = require('utils');

// Setup log
var log = logger.getLogger();
log.setLevel(config.logLevel);

// Keep track of last warning time
var lastDefWarning = 0;

function towerDefense(room) {
    // Run tower defense
    var enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        // Send warning to console
        if (Game.time - lastDefWarning > 200) {
            lastDefWarning = Game.time;
            log.warn("We're under attack! Towers activated.");
        }
        // Get list of towers
        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });
        // Attack enemies
        towers.forEach(tower => tower.attack(enemies[0]));
    }
}

module.exports.loop = function main() {
    // Remove dead creeps from memory
    memManager.cleanCreeps();

    // Creep Spawner
    popManager.spawnCreeps();

    $(Game.spawns).each((s) => {
        var spawn = Game.spawns[s];

        // Run all creep roles
        $(spawn.room.find(FIND_MY_CREEPS)).each((creep) => {
            if (population.hasOwnProperty(creep.memory.role)) {
                population[creep.memory.role].role.run(creep, spawn);
                population[creep.memory.role].role.draw(creep);
            } else {
                log.warn(`Error running creep ${creep.name}, Memory: ${JSON.stringify(creep.memory)}`);
            }
        });

        // Defend room
        towerDefense(spawn.room);
    });
}
