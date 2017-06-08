var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');

var roleMule = new Role();

roleMule.run = function run(creep, spawn) {
    var log = logger.getLogger('RoleMule', logger.DEBUG);
    var totalCarry = creep.totalCarry;
    var eStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType === STRUCTURE_TOWER ||
                s.structureType === STRUCTURE_EXTENSION ||
                s.structureType === STRUCTURE_SPAWN) &&
            s.energy < s.energyCapacity
    });

    if (creep.carry.energy == 0) {
        creep.memory.collecting = true;
    }
    if (creep.totalCarry == creep.carryCapacity) {
        creep.memory.collecting = false;
    }

    if (!creep.memory.collecting) {
        // If a tower exists try to fill it with energy
        creep.transfer_move(eStructure);
    } else if (creep.memory.collecting) {
        creep.obtainClosestSource(creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_STORAGE)
        }));
    } else {
        // Fall back to upgrader
        roleUpgrader.run(creep);
    }
};

roleMule.icon = "🐎";

module.exports = roleMule;
