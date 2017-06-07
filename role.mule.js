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

roleMule.run = function run(creep) {
        var log = logger.getLogger('RoleMule');

        var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {

                    if (tower) {
                        // If a tower exists try to fill it with energy
                        getAndTransfer(creep, tower);
                    }
                    if (spawn.energy < spawn.energyCapacity)
                    {
                        getAndTransfer(creep, spawn);
                    }
                    else
                    {
                        // Fall back to upgrader
                        roleUpgrader.run(creep);
                    }
                }
});
                module.exports = roleMule;
