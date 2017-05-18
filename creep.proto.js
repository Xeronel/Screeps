Creep.prototype.harvest_move = function (target) {
    if (this.memory.lastAction !== 'harvest_move') {
        this.say('⛏️ harvest');
    }
    if (this.harvest(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                stroke: '#ffaa00'
            }
        });
    }
    this.memory.lastAction = 'harvest_move'
}

Creep.prototype.repair_move = function (target) {
    if (this.memory.lastAction !== 'repair_move') {
        this.say('🔧 repair');
    }
    if (this.repair(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                stroke: '#B42929'
            }
        });
    }
    this.memory.lastAction = 'repair_move';
}

Creep.prototype.build_move = function (target) {
    if (this.memory.lastAction !== 'build_move') {
        this.say('🔨 build');
    }
    if (this.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                stroke: '#7EC366'
            }
        });
    }
    this.memory.lastAction = 'build_move';
}

Creep.prototype.transfer_move = function (target) {
    if (this.memory.lastAction !== 'transfer_move') {
        this.say('🚚 deposit');
    }
    if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                stroke: '#ffffff'
            }
        });
    }
    this.memory.lastAction = 'transfer_move';
}

Creep.prototype.upgrade_move = function () {
    if (this.memory.lastAction !== 'upgrade_move') {
        this.say('⚡ upgrade');
    }
    if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller, {
            visualizePathStyle: {
                stroke: '#00ffff'
            }
        });
    }
    this.memory.lastAction = 'upgrade_move';
}
