var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

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
    },
    'repairer': {
        qty: 2,
        role: roleRepairer
    }
};

module.exports = population;
