var roleRepairer = require('role.repairer');
var logger = require('logger');
var config = require('config');

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
            untargetedStructures = roleRepairer.getUntargetedStructures(tower, {
                filter: (structure) => {
                    // Repair object in memory
                    var repairing = Memory.repairing[structure.id];
                    if (structure.hits == structure.hitsMax) {
                        // Exclude if structure has full HP
                        return false;
                    } else if (structure.hits >= 100000) {
                        // Exclude if structure has >= 100k HP
                        return false;
                    }
                    if (repairing && repairing === tower.id) {
                        // Include if the tower is already targeting this structure
                        return true;
                    } else if (repairing && repairing !== tower.id) {
                        // Exclude if another object is targeting this structure
                        return false;
                    } else {
                        return true;
                    }
                }
            });
            var repairTarget;

            if (tower.memory.repairTarget) {
                repairTarget = Game.getObjectById(tower.memory.repairTarget);
                //count for each interval that a unit is repairing
                if (Memory.TowerRepTime[tower.id] === undefined) {
                    Memory.TowerRepTime[tower.id] = 0;
                } else {
                    Memory.TowerRepTime[tower.id] += 1
                }

                var hitPcnt = repairTarget.hits / repairTarget.hitsMax;

                // Repair structures to at least 25% or 200 ticks or 100k HP
                if (repairTarget.hits >= config.tower.maxRepair ||
                    repairTarget.hits === repairTarget.hitsMax ||
                    Memory.TowerRepTime[tower.id] >= config.tower.time ||
                    (untargetedStructures[0].ticksToDecay <= config.repair.minDecayTime &&
                        untargetedStructures[0].hits <= config.repair.minHits)) {

                    log.debug(`${Memory.TowerRepTime[tower.id]}`);
                    delete Memory.repairing[repairTarget.id];
                    Memory.TowerRepTime[tower.id] = 0;

                    if (untargetedStructures[0]) {
                        repairTarget = untargetedStructures[0];
                        tower.memory.repairTarget = repairTarget.id;
                        Memory.repairing[repairTarget.id] = tower.id;
                    }
                }
            } else {
                if (untargetedStructures[0]) {
                    repairTarget = untargetedStructures[0];
                    tower.memory.repairTarget = repairTarget.id;
                    Memory.repairing[repairTarget.id] = tower.id;
                }
            }
            if (repairTarget) {
                tower.repair(repairTarget);
            }
        }
    }
}

structureManager.run = function run() {
    for (roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var enemies = room.find(FIND_HOSTILE_CREEPS);
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
}
module.exports = structureManager;
