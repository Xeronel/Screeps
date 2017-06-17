var logger = require('logger');
var population = require('population');

if (Memory.memTimer === undefined) {
    Memory.memTimer = 0;
}

function memoryManager() {};
memoryManager.log = logger.getLogger('MemMan');
memoryManager.cleanCreeps = function cleanCreeps() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            if (population.hasOwnProperty(Memory.creeps[name].role)) {
                population[Memory.creeps[name].role].role.onDeath(name);
            }
            if (Memory.creeps[name] !== undefined) {
                this.log.debug(`Deleted ${name} from memory.`);
                delete Memory.creeps[name];
            }
        }
    }
};

memoryManager.cleanTowers = function cleanTowers() {
    for (var id in Memory.towers) {
        if (!Memory.towers[id]) {
            StructureTower.onDeath(id);
            if (Memory.towers[id] !== undefined) {
                this.log.debug(`Deleted ${id} from memory.`);
                delete Memory.towers[id];
            }
        }
    }
};

memoryManager.run = function run() {
    Memory.memTimer += 1;
    this.cleanCreeps();
    if (Memory.memTimer >= 50) {
        this.cleanTowers();
        Memory.memTimer = 0;
    }
};

module.exports = memoryManager;
