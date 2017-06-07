var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');

var roleMule = new Role();

function getAndTransfer(creep, target, totalCarry) {
    if (creep.carry.energy === 0) {
        creep.obtainClosestSource(creep.findClosestSource());
    } else if (totalCarry - creep.carry.energy > 0) {
        creep.transfer_move(creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_CONTAINER ||
                s.structureType === STRUCTURE_STORAGE
        }));
    } else {
        creep.transfer_move(target);
    }
}

roleMule.run = function run(creep, spawn) {
    var log = logger.getLogger('RoleMule');

    var eStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_TOWER ||
            s.structureType === STRUCTURE_EXTENSION ||
            s.structureType === STRUCTURE_SPAWN &&
            s.energy < s.energyCapacity
    });
    var totalCarry = _.sum(creep.carry);
    if (eStructure && totalCarry > 0) {
        // If a tower exists try to fill it with energy
        getAndTransfer(creep, eStructure, totalCarry);
    } else {
        // Fall back to upgrader
        roleUpgrader.run(creep);
    }
}
module.exports = roleMule;
