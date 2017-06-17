var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');
var roleMule = require('role.mule');
var config = require('config');
var logger = require('logger');
var $ = require('utils');
const profiler = require('screeps-profiler');

var log = logger.getLogger('Population');

var population = {
    'upgrader': {
        qtyFnc: config.population.upgrader.qtyFnc ||
            function () {
                return config.population.upgrader.qty;
            },
        role: roleUpgrader,
        parts: config.population.upgrader.parts
    },
    'builder': {
        qtyFnc: config.population.builder.qtyFnc ||
            function (room) {
                if (config.population.builder.qty !== undefined) {
                    return config.population.builder.qty;
                } else {
                    return Math.min(Math.round(
                            room.find(FIND_CONSTRUCTION_SITES).length *
                            config.population.builder.percentConstSites),
                        config.population.builder.maxBuilders);
                }
            },
        role: roleBuilder,
        parts: config.population.builder.parts
    },
    'repairer': {
        qtyFnc: config.population.repairer.qtyFnc ||
            function () {
                return config.population.repairer.qty;
            },
        role: roleRepairer,
        parts: config.population.repairer.parts
    },
    'attacker': {
        qtyFnc: config.population.attacker.qtyFnc ||
            function (room) {
                if (config.population.attacker.qty !== undefined) {
                    return config.population.builder.qty;
                } else {
                    var flags = room.find(FIND_FLAGS).length;
                    //define your army size
                    var armySize = 4;
                    if (flags > 0) {
                        log.warn("We're going to WAR! Attacker spawning activated.");
                        return armySize * flags;
                    }
                }
            },
        role: roleAttacker,
        parts: config.population.attacker.parts
    },
    'mule': {
        qtyFnc: config.population.mule.qtyFnc ||
            function (room) {
                if (config.population.builder.qty !== undefined) {
                    return config.population.builder.qty;
                } else {
                    return room.find(FIND_MY_STRUCTURES, {
                        filter: {
                            structureType: STRUCTURE_TOWER
                        }
                    }).length;
                }
            },
        role: roleMule,
        parts: config.population.mule.parts
    },
    'defender': {
        qtyFnc: config.population.defender.qtyFnc ||
            function (room) {
                if (config.population.builder.qty !== undefined) {
                    return config.population.builder.qty;
                } else {
                    var enemies = room.find(FIND_HOSTILE_CREEPS).length;
                    if (enemies) {
                        return enemies;
                    } else {
                        return 0;
                    }
                }
            },
        role: roleDefender,
        parts: config.population.defender.parts
    },
    'harvester': {
        rooms: {},
        qtyFnc: config.population.harvester.qtyFnc ||
            function (room) {
                if (config.population.builder.qty !== undefined) {
                    return config.population.builder.qty;
                } else {
                    if (room.memory.harvestablePos === undefined) {
                        log.debug('Calculating harvestable positions.');
                        // Count the number of walkable tiles around each source
                        var harvestablePos = 0;
                        $(room.find(FIND_SOURCES)).each((source) => {
                            harvestablePos += $(source).countHarvestable();
                        });
                        // Cache the result
                        room.memory.harvestablePos = harvestablePos;
                    }
                    return room.memory.harvestablePos;
                }
            },
        role: roleHarvester,
        parts: config.population.harvester.parts
    }

};
profiler.registerClass(population, 'population');
module.exports = population;
