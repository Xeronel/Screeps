var logger = require('logger');
var population = require('population');
var $ = require('utils');

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

memoryManager.cleanStructures = function cleanStructures() {
    $(Memory.rooms).each((room, roomName) => {
        $(room.structures).each((sMem, sType) => {
            $(sMem).each((s, sId) => {
                if (!Game.getObjectById(sId)) {
                    this.log.debug(`Deleted structure ${sId}`);
                    delete Memory.rooms[roomName].structures[sType][sId];
                }
            });
        });
    });
}

memoryManager.run = function run() {
    Memory.memTimer += 1;
    this.cleanCreeps();
    // Clean long lived memory
    if (Memory.memTimer >= 50) {
        this.cleanStructures();
        this.cleanTowers();
        Memory.memTimer = 0;
    }
};

module.exports = memoryManager;
