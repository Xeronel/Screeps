var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var $ = require('utils');

var population = {
    'harvester': {
        qty: function qty(room) {
            var sources = room.find(FIND_SOURCES);
            // Make sure a room object exists
            if (!this.rooms)
                this.rooms = {};

            // If this is a new room add it
            if (!this.rooms[room.name])
                this.rooms[room.name] = {
                    'harvestablePos': 0
                };

            // Number of positions available around sources
            var harvestablePos = this.rooms[room.name].harvestablePos;
            if (harvestablePos === 0) {
                // Count the number of walkable tiles around each source
                $(sources).each((source) => {
                    var pos = source.pos;
                    var tiles = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
                    var walkable = _.filter(tiles, (tile) => tile.type === 'terrain' && tile.terrain !== 'wall').length;
                    harvestablePos += walkable;
                });
                // Cache the result
                this.rooms[room.name].harvestablePos = harvestablePos;
            }
            return harvestablePos;
        },
        role: roleHarvester,
        parts: [
            [MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],
            [MOVE, CARRY, CARRY, CARRY, WORK, WORK],
            [MOVE, CARRY, CARRY, WORK, WORK],
            [MOVE, CARRY, WORK, WORK], // Cost 300
            [MOVE, CARRY, WORK]
        ]
    },
    'upgrader': {
        qty: () => 1,
        role: roleUpgrader,
        parts: [
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK],
            [MOVE, MOVE, CARRY, WORK, WORK],
            [MOVE, CARRY, WORK, WORK],
            [MOVE, CARRY, WORK]
        ]
    },
    'builder': {
        qty: () => 4,
        role: roleBuilder,
        parts: [
            [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, CARRY, WORK],
            [MOVE, CARRY, WORK]
        ]
    },
    'repairer': {
        qty: () => 2,
        role: roleRepairer,
        parts: [
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK],
            [MOVE, MOVE, CARRY, WORK, WORK],
            [MOVE, CARRY, WORK, WORK],
            [MOVE, CARRY, WORK]
        ]
    }
};

module.exports = population;
