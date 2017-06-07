var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');

var roleMule = new Role();

function getAndTransfer(creep, target) {
    if (_.sum(creep.carry) < creep.carryCapacity) {
        creep.obtainClosestSource(creep.findClosestSource());
    } else {
        creep.transfer_move(target);
    }
}

roleMule.run = function run(creep, spawn) {
    var log = logger.getLogger('RoleMule');

    var eStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
    });

    if (eStructure) {
        // If a tower exists try to fill it with energy
        getAndTransfer(creep, eStructure);
    } else if (spawn.energy < spawn.energyCapacity) {
        getAndTransfer(creep, spawn);
    } else {
        // Fall back to upgrader
        roleUpgrader.run(creep);
    }
}
module.exports = roleMule;
