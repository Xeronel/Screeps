var roleRepairer = require('role.repairer');
var logger = require('logger');
var structureManager = {};

// Keep track of last warning time
Memory.lastDefWarning = 0;
var log = logger.getLogger('StrucMan');

// If object doesn't exist in memory then create it
if (Memory.TowerRepTime == undefined) {
    Memory.TowerRepTime = {};
}

function towerDefense(room, enemies, towers) {
    // Run tower defense
    if (Game.time - Memory.lastDefWarning > 200) {
        Memory.lastDefWarning = Game.time;
        log.warn("We're under attack! Towers activated.");
    }

    // Attack enemies
    towers.forEach(tower => tower.attack(enemies[0]));
}

function towerRepair(room, towers) {
    for (var i = 0; i < towers.length; i++) {
        var tower = towers[i];
        // Only repair if tower is above 50% energy
        if (tower.energy > tower.energyCapacity * 0.5) {
            repairTarget = roleRepairer.getLastRepairTarget(tower);
            untargetedStructures = roleRepairer.getUntargedStructures(tower);

            if (repairTarget) {
                //count for each interval that a unit is repairing
                if (Memory.TowerRepTime[tower.id]) {
                    Memory.TowerRepTime[tower.id] += 1;
                } else {
                    Memory.TowerRepTime[tower.id] = 0;
                }

                var hitPcnt = repairTarget.hits / repairTarget.hitsMax;
                // Repair structures to at least 25% or 200 ticks
                if (repairTarget.hits === repairTarget.hitsMax || Memory.TowerRepTime[tower.id] >= 200) {
                    delete Memory.repairing[repairTarget.id];
                    Memory.TowerRepTime[tower.id] = 0;
                    if (untargetedStructures[0]) {
                        repairTarget = untargetedStructures[0];
                        Memory.repairing[repairTarget.id] = tower.id;
                    }

                    var hitPcnt = repairTarget.hits / repairTarget.hitsMax;
                    // Repair structures to at least 25% or 200 ticks
                    if (repairTarget.hits === repairTarget.hitsMax || Memory.TowerRepTime[c.id] >= 200) {
                        delete Memory.repairing[repairTarget.id];
                        Memory.TowerRepTime[c.id] = 0;
                        if (untargetedStructures[0]) {
                            repairTarget = untargetedStructures[0];
                            Memory.repairing[repairTarget.id] = c.id;
                        }
                    }
                } else if (untargetedStructures[0]) {
                    repairTarget = untargetedStructures[0];
                    Memory.repairing[repairTarget.id] = tower.id;
                }
            }
            if (repairTarget) {
                tower.repair(repairTarget);
            }
        }
    }
}

structureManager.run = function run(room) {
    var enemies = room.find(FIND_HOSTILE_CREEPS);
    log.debug(`There are ${enemies.length}`);
    // Get list of towers
    var towers = room.find(FIND_MY_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_TOWER
        }
    });
    if (enemies.length > 0) {
        towerDefense(room, enemies, towers);
    } else {
        towerRepair(room, towers);
    }
}
module.exports = structureManager;
