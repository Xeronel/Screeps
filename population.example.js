var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');
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
        qty: () => 1,
        role: roleBuilder,
        parts: [
            [MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, WORK]
        ]
    },
    'repairer': {
        qty: () => 0,
        role: roleRepairer,
        parts: [
            [MOVE, MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, WORK]
        ]
    },
    'attacker': {
        qty: (room) => {
            var flags = room.find(FIND_FLAGS).length;
            //define your army size
            var armySize = 4;
            if (flags > 0) {
                log.warn("We're going to WAR! Unit Spawning Activated.");
                return armySize * flags;
            }
        },
        role: roleAttacker,
        parts: [
            [MOVE, MOVE, RANGED_ATTACK],
            [MOVE, RANGED_ATTACK],
            [MOVE, MOVE, ATTACK],
            [MOVE, ATTACK]
        ]
    },
    'mule': {
        qty: (room) => {
            //qty = find number of towers + max(round(number of extensions/10),1)
            var totalqty = room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_TOWER
                }
            }).length + Math.max(Math.round(room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_EXTENSION
                }
            }).length / 10), 1);

            if (room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_STORAGE && s.energy > 10000
                }).length > 0) {
                return totalqty;
            } else {
                return 2;
            }
        },
        role: roleMule,
        parts: [
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY]
        ]
    },
    'defender': {
        qty: (room) => {
            var enemies = room.find(FIND_HOSTILE_CREEPS).length;
            if (enemies) {
                return enemies;
            } else {
                return 0;
            }
        },
        role: roleDefender,
        parts: [
            [MOVE, MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK],
            [MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK],
            [MOVE, MOVE, TOUGH, RANGED_ATTACK]
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
