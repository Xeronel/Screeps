var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');
var roleMule = require('role.mule');
var $ = require('utils');

var population = {
    'upgrader': {
        qty: () => 1,
        role: roleUpgrader,
        parts: [
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK],
            [MOVE, MOVE, CARRY, CARRY, CARRY, WORK],
            [MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, WORK]
        ]
    },
    'builder': {
        qty: () => 3,
        role: roleBuilder,
        parts: [
            [MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, WORK]
        ]
    },
    'repairer': {
        qty: () => 2,
        role: roleRepairer,
        parts: [
            [MOVE, MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, WORK]
        ]
    },
    'mule': {
        qty: (sources) => {
            var towers = room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            }).length;
            if (towers) {
                return towers;
            } else {
                return 0;
            }
        },
        role: roleMule,
        parts: [
            [MMOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY]
        ]
    },
    'defender': {
        qty: (enemies) => {
            var enemies = room.find(FIND_HOSTILE_CREEPS).length;
            if (enemies) {
                return enemies;
            } else {
                return 0;
            }
        },
        role: roleDefender,
        parts: [
            [MOVE, MOVE, MOVE, TOUGH, RANGED_ATTACK],
            [MOVE, MOVE, TOUGH, RANGED_ATTACK],
            [MOVE, MOVE, RANGED_ATTACK]
        ]
    },
    'harvester': {
        rooms: {},
        qty: (room) => {
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
        parts: [
            [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK],
            [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK],
            [MOVE, CARRY, WORK, WORK, WORK, WORK],
            [MOVE, CARRY, WORK, WORK, WORK],
            [MOVE, CARRY, WORK, WORK],
            [MOVE, CARRY, WORK]
        ]
    }

};

$(population).each(function (role) {
    population[role].cost = partCost(population[role].parts);
});

function partCost(parts) {
    var cost = 0;
    for (var i = 0; i < parts.length; i++) {
        cost += BODYPARTS_ALL[parts[i]];
    }
    return cost;
}

module.exports = population;
