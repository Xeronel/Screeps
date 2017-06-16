require('creep.proto');
require('spawn.proto');
require('structure.proto');
var config = require('config');
var logger = require('logger');
var popManager = require('population.manager');
var memManager = require('memory.manager');
var struManager = require('structure.manager')
var $ = require('utils');

// Setup root logger
var log = logger.getLogger();
log.setLevel(config.log.level);

module.exports.loop = function main() {
    memManager.run();
    popManager.spawnCreeps();
    struManager.run();
    popManager.runCreeps();
}
