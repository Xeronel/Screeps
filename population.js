var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');
var roleMule = require('role.mule');
var config = require('config')
var $ = require('utils');

var population = {
    'upgrader': {
        qtyFnc: config.population.upgrader.qtyFnc || function () {
            return config.population.upgrader.qty;
        },
        role: roleUpgrader,
        parts: config.population.upgrader.parts
    },
    'builder': {
        qtyFnc: config.population.builder.qtyFnc || function (room) {
            return Math.min(Math.round(
                    room.find(FIND_CONSTRUCTION_SITES).length *
                    config.population.builder.percentConstSites),
                config.population.builder.maxBuilders);
        },
        role: roleBuilder,
        parts: config.population.builder.parts
    },
    'repairer': {
        qtyFnc: config.population.repairer.qtyFnc || function () {
            return config.population.repairer.qty;
        },
        role: roleRepairer,
        parts: config.population.repairer.parts
    },
    'attacker': {
        qtyFnc: config.population.attacker.qtyFnc || function (room) {
            var flags = room.find(FIND_FLAGS).length;
            //define your army size
            var armySize = 4;
            if (flags > 0) {
                log.warn("We're going to WAR! Unit Spawning Activated.");
                return armySize * flags;
            }
        },
        role: roleAttacker,
        parts: config.population.attacker.parts
    },
    'mule': {
        qtyFnc: config.population.mule.qtyFnc || function (room) {
            return room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            }).length;
        },
        role: roleMule,
        parts: config.population.mule.parts
    },
    'defender': {
        qtyFnc: config.population.defender.qtyFnc || function (room) {
            var enemies = room.find(FIND_HOSTILE_CREEPS).length;
            if (enemies) {
                return enemies;
            } else {
                return 0;
            }
        },
        role: roleDefender,
        parts: config.population.defender.parts
    },
    'harvester': {
        rooms: {},
        qtyFnc: config.population.harvester.qtyFnc || function (room) {
            var sources = room.find(FIND_SOURCES);

            // If this is a new room add it
            if (!population.harvester.rooms[room.name])
                population.harvester.rooms[room.name] = {
                    'harvestablePos': 0
                };

            // Number of positions available around sources
            var harvestablePos = population.harvester.rooms[room.name].harvestablePos;
            if (harvestablePos === 0) {
                // Count the number of walkable tiles around each source
                $(sources).each((source) => {
                    var pos = source.pos;
                    var tiles = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
                    var walkable = _.filter(tiles, (tile) => tile.type === 'terrain' && tile.terrain !== 'wall').length;
                    harvestablePos += walkable;
                });
                // Cache the result
                population.harvester.rooms[room.name].harvestablePos = harvestablePos;
            }
            return harvestablePos + 1;
        },
        role: roleHarvester,
        parts: config.population.harvester.parts
    }

};

module.exports = population;

/* $(population).each(function (role) {
    population[role].cost = partCost(population[role].parts);
});

function partCost (parts) {
    var cost = 0;
    $(parts).each((s) => {
        cost += BODYPART_COST[s];
    });
    return cost;
} */
