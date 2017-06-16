var logger = require('logger');

var config = {
    population: {
        upgrader: {
            'parts': [
                [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK],
                [MOVE, MOVE, CARRY, CARRY, CARRY, WORK],
                [MOVE, MOVE, CARRY, CARRY, WORK],
                [MOVE, CARRY, CARRY, WORK],
                [MOVE, CARRY, WORK]
            ]
        },
        builder: {
            'percentConstSites': .5,
            'maxBuilders': 10,
            'parts': [
                [MOVE, MOVE, CARRY, CARRY, WORK],
                [MOVE, CARRY, CARRY, WORK],
                [MOVE, CARRY, WORK]
            ]
        },
        repairer: {
            'qty': 1,
            'parts': [
                [MOVE, MOVE, MOVE, CARRY, CARRY, WORK],
                [MOVE, MOVE, CARRY, CARRY, WORK],
                [MOVE, CARRY, CARRY, WORK],
                [MOVE, CARRY, WORK]
            ]
        },
        attacker: {
            'parts': [
                [MOVE, MOVE, RANGED_ATTACK],
                [MOVE, RANGED_ATTACK],
                [MOVE, MOVE, ATTACK],
                [MOVE, ATTACK]
            ]
        },
        mule: {
            'parts': [
                [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
                [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
                [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
                [MOVE, MOVE, CARRY, CARRY, CARRY],
                [MOVE, MOVE, CARRY, CARRY]
            ]
        },
        defender: {
            'parts': [
                [MOVE, MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK],
                [MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK],
                [MOVE, MOVE, TOUGH, RANGED_ATTACK]
            ]
        },
        harvester: {
            'parts': [
                [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK],
                [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK],
                [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK],
                [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK],
                [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],
                [MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],
                [MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],
                [MOVE, CARRY, CARRY, CARRY, WORK, WORK],
                [MOVE, CARRY, CARRY, WORK, WORK],
                [MOVE, CARRY, WORK, WORK],
                [MOVE, CARRY, WORK]
            ]
        }
    },
    log: {
        'level': logger.INFO
    },
    spawn: {
        // CONSTANTS USED IN POPULATION MANAGER
        // Every 50 is 10 seconds on a 200ms/tick server
        'time': 150,
        // Uses a set percent of your energy for part calculation
        'maxEnergyPercent': .6
    },
    tower: {
        // Tower repair time: every 50 is 10 seconds on a 200ms/tick server
        'time': 50,
        'maxRepair': 100000,
        // Min % of energy a tower will use b4 it stops repairing
        'minEnRepair': .5
    },
    repair: {
        'minDecayTime': 10,
        'minHits': 100,
        'maxRepairTime': 200
    }
};

module.exports = config;
