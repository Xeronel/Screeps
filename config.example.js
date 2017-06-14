var logger = require('logger');

var config = {
    'logLevel': logger.INFO,
    //Every 50 is 10 seconds on a 200ms/tick server
    'spawnTime': 150
};

module.exports = config;
