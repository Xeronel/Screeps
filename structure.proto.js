var logger = require('logger');
var log = logger.getLogger('StrucProto');

Object.defineProperty(StructureTower.prototype, 'memory', {
    get: function () {
        if (Memory.towers === undefined) {
            Memory.towers = {};
        }
        if (Memory.towers[this.id] === undefined) {
            Memory.towers[this.id] = {};
        }
        return Memory.towers[this.id];
    }
});

StructureTower.prototype.onDeath = function onDeath(id) {
    delete Memory.repairing[Memory.towers[id].repairTarget];
    delete Memory.towerRepTime[id];
};

Object.defineProperty(Structure.prototype, 'memory', {
    get: function () {
        if (this.triggers === true) {
            if (this.room.memory.structures === undefined) {
                this.room.memory.structures = {};
            }
            if (this.room.memory.structures[this.structureType] === undefined) {
                this.room.memory.structures[this.structureType] = {};
            }
            if (this.room.memory.structures[this.structureType][this.id] === undefined) {
                this.room.memory.structures[this.structureType][this.id] = {};
            }
            return this.room.memory.structures[this.structureType][this.id];
        } else {
            log.error(`${this.structureType} does not have memory enabled.`);
            return {};
        }
    }
});

Structure.prototype.triggers = false;
Object.defineProperty(Structure.prototype, 'onConstruct', {
    get: function () {
        return function onConstruct() {
            if (this.triggers) {
                this.memory.constructed = true;
            }
            this._onConstruct.apply(this, arguments);
        }
    },
    set: function (fn) {
        this._onConstruct = fn;
    }
});
