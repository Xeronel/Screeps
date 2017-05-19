var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var population = {
    'harvester': {
        qty: 3,
        role: roleHarvester,
        parts: [MOVE, CARRY, WORK, WORK] // Cost 300
    },
    'upgrader': {
        qty: 0,
        role: roleUpgrader,
        parts: [MOVE, MOVE, CARRY, WORK, WORK]
    },
    'builder': {
        qty: 3,
        role: roleBuilder,
        parts: [MOVE, MOVE, CARRY, WORK, WORK]
    },
    'repairer': {
        qty: 2,
        role: roleRepairer,
        parts: [MOVE, MOVE, CARRY, WORK, WORK]
    }
};

module.exports = population;
