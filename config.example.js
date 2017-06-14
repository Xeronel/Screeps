var logger = require('logger');

var config = {
    log: {
        'level': logger.INFO
    },
    spawn: {
        //CONSTANTS USED IN POPULATION MANAGER
        //Every 50 is 10 seconds on a 200ms/tick server
        'time': 150,
        //Uses a set percent of your energy for part calculation
        'maxEnergyPercent': .6
    },
    tower: {
        //tower repair time: every 50 is 10 seconds on a 200ms/tick server
        'time': 50,
        'maxRepair': 100000
    },
    repair: {
        'minDecayTime': 10,
        'minHits': 100
    }
};

module.exports = config;
