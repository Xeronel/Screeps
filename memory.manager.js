var logger = require('logger');
var population = require('population');

var memManager = {};
memManager.cleanCreeps = function cleanCreeps() {
    var log = logger.getLogger('MemMan');
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            if (population.hasOwnProperty(Memory.creeps[name].role)) {
                population[Memory.creeps[name].role].role.onDeath(name, Memory.creeps[name]);
            }
            if (Memory.creeps[name] !== undefined) {
                log.debug(`Deleted ${name} from memory.`);
                delete Memory.creeps[name];
            }
        }
    }
};

module.exports = memManager;
