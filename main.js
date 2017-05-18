require('creep.proto');
var popManager = require('population.manager');
var memManager = require('memory.manager');
var population = require('population');

module.exports.loop = function () {
    // Remove dead creeps from memory
    memManager.cleanCreeps();

    // Creep Spawner
    popManager.spawnCreeps();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (population.hasOwnProperty(creep.memory.role)) {
            population[creep.memory.role].role.run(creep);
            population[creep.memory.role].role.draw(creep);
        } else {
            console.log('Error: ' + creep.memory.role + ' is not in role list.');
        }
    }
}
