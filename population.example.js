var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var population = {
    'harvester': {
        qty: 3,
        role: roleHarvester
    },
    'upgrader': {
        qty: 2,
        role: roleUpgrader
    },
    'builder': {
        qty: 3,
        role: roleBuilder
    }
};

module.exports = population;
