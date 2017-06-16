var logger = require('logger');
var population = require('population');

var memManager = {};

if (Memory.memTimer === undefined) {
    Memory.memTimer = 0;
}

memManager.cleanCreeps = function cleanCreeps() {
    var log = logger.getLogger('MemMan');
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            if (population.hasOwnProperty(Memory.creeps[name].role)) {
                population[Memory.creeps[name].role].role.onDeath(name);
            }
            if (Memory.creeps[name] !== undefined) {
                log.debug(`Deleted ${name} from memory.`);
                delete Memory.creeps[name];
            }
        }
    }
};

memManager.cleanTowers = function cleanTowers() {
    var log = logger.getLogger('MemMan');
    for (var id in Memory.towers) {
        if (!Memory.towers[id]) {
            StructureTower.onDeath(id);
            if (Memory.towers[id] !== undefined) {
                log.debug(`Deleted ${id} from memory.`);
                delete Memory.towers[id];
            }
        }
    }
};

memManager.run = function run() {
    Memory.memTimer += 1;
    memManager.cleanCreeps();
    if (Memory.memTimer >= 50) {
        memManager.cleanTowers();
        Memory.memTimer = 0;
    }
}

module.exports = memManager;
