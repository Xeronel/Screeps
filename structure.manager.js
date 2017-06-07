var roleRepairer = require('role.repairer');
var logger = require('logger');
var structureManager = {};

// Keep track of last warning time
Memory.lastDefWarning = 0;
var log = logger.getLogger('StrucMan');
Memory.TowerRepTime = {};

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
        var c = towers[i];
        repairTarget = roleRepairer.getLastRepairTarget(c);
        untargetedStructures = roleRepairer.getUntargedStructures(c);

        if (repairTarget) {
            //count for each interval that a unit is repairing
            if (Memory.TowerRepTime[c.id]) {
                Memory.TowerRepTime[c.id] += 1;
            } else {
                Memory.TowerRepTime[c.id] = 0;
            }

            var hitPcnt = repairTarget.hits / repairTarget.hitsMax;
            // Repair structures to at least 25% or 200 ticks
            if (repairTarget.hits === repairTarget.hitsMax || Memory.TowerRepTime[c.id] >= 200) {
                delete Memory.repairing[repairTarget.id];
                Memory.TowerRepTime[c.id] = 0;
                if (untargetedStructures[0]) {
                    //log.debug(`${creep.name} changed from ${repairTarget.id}(${hitPcnt}) to ${untargetedStructures[0].id}(${untargetedStructures[0].hits / untargetedStructures[0].hitsMax})`);
                    repairTarget = untargetedStructures[0];
                    Memory.repairing[repairTarget.id] = c.id;
                }
            }

        } else {
            if (untargetedStructures[0]) {
                repairTarget = untargetedStructures[0];
                Memory.repairing[repairTarget.id] = c.id;
                //log.debug(`${creep.name} set new target ${repairTarget.id}`);

            }
        }
        if (repairTarget) {
            c.repair(repairTarget);
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
