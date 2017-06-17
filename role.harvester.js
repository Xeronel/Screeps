var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');
var $ = require('utils');

var roleHarvester = new Role();
roleHarvester.log = logger.getLogger('RoleHarvest');

roleHarvester.onSpawn = function onSpawn(creep) {
    if (Memory.sources === undefined) {
        Memory.sources = {};
    }
    // Get an untargeted source
    var source = creep.pos.findClosestByPath(FIND_SOURCES, {
        ignoreCreeps: true,
        filter: (s) => Memory.sources[s.id] === undefined || Memory.sources[s.id] < $(s).countHarvestable()
    });
    creep.memory.source = source.id;
    if (Memory.sources[source.id] === undefined) {
        this.log.debug(`${creep.name} created ${source.id}`);
        Memory.sources[source.id] = 1;
    } else {
        Memory.sources[source.id]++;
        this.log.debug(`${creep.name} incremented ${source.id} to ${Memory.sources[source.id]}`);
    }
};

roleHarvester.onDeath = function onDeath(name) {
    var sourceId = Memory.creeps[name].source;
    if (Memory.sources && Memory.sources[sourceId]) {
        Memory.sources[sourceId]--;
        this.log.debug(`${name} decremented ${sourceId} ${Memory.sources[sourceId]}`);
    }
};

roleHarvester.run = function run(creep) {
    if (creep.carry.energy == 0) {
        creep.memory.collecting = true;
    }
    if (creep.totalCarry == creep.carryCapacity) {
        creep.memory.collecting = false;
    }

    // If creep isn't carrying max capacity, harvest
    if (creep.memory.collecting) {
        source = Game.getObjectById(creep.memory.source);
        creep.harvest_move(source);
    } else {
        var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => {
                if (s.structureType === STRUCTURE_STORAGE) {
                    if (s.store.energy < s.storeCapacity) {
                        return true;
                    }
                } else if (s.structureType === STRUCTURE_EXTENSION) {
                    if (s.energy < s.energyCapacity) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        });
        if (storage) {
            creep.transfer_move(storage);
        } else {
            roleUpgrader.run(creep);
        }
    }
};

roleHarvester.icon = "⛏";

module.exports = roleHarvester;
