require('creep.proto');
require('spawn.proto');
require('structure.proto');
// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
const profiler = require('screeps-profiler');
var config = require('config');
var logger = require('logger');
var popManager = require('population.manager');
var memManager = require('memory.manager');
var struManager = require('structure.manager')
var $ = require('utils');

// This line monkey patches the global prototypes.
profiler.enable();

// Setup root logger
var log = logger.getLogger();
log.setLevel(config.log.level);

module.exports.loop = function main() {
    profiler.wrap(function () {
        memManager.run();
        popManager.spawnCreeps();
        struManager.run();
        popManager.runCreeps();
    });
}
