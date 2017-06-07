Creep.prototype.pickup_move = function pickup_move(target) {
    if (this.memory.lastAction !== 'pickup_move') {
        this.say('pickup');
    }
    if (this.pickup(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                opacity: 0.5,
                stroke: '#ffaa00'
            }
        });
    }
    this.memory.lastAction = 'pickup_move';
}

Creep.prototype.harvest_move = function harvest_move(target) {
    if (this.memory.lastAction !== 'harvest_move') {
        this.say('⛏️ harvest');
    }
    if (this.harvest(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                opacity: 0.5,
                stroke: '#ffaa00'
            }
        });
    }
    this.memory.lastAction = 'harvest_move'
}

Creep.prototype.repair_move = function repair_move(target) {
    if (this.memory.lastAction !== 'repair_move') {
        this.say('🔧 repair');
    }
    if (this.repair(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                opacity: 0.5,
                stroke: '#B42929'
            }
        });
    }
    this.memory.lastAction = 'repair_move';
}

Creep.prototype.build_move = function build_move(target) {
    if (this.memory.lastAction !== 'build_move') {
        this.say('🔨 build');
    }
    if (this.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                opacity: 0.5,
                stroke: '#7EC366'
            }
        });
    }
    this.memory.lastAction = 'build_move';
}

Creep.prototype.transfer_move = function transfer_move(target, resourceType = RESOURCE_ENERGY) {
    if (this.memory.lastAction !== 'transfer_move') {
        this.say('🚚 deposit');
    }
    if (this.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                opacity: 0.5,
                stroke: '#ffffff'
            }
        });
    }
    this.memory.lastAction = 'transfer_move';
}

Creep.prototype.upgrade_move = function upgrade_move() {
    if (this.memory.lastAction !== 'upgrade_move') {
        this.say('⚡ upgrade');
    }
    if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller, {
            visualizePathStyle: {
                opacity: 0.5,
                stroke: '#00ffff'
            }
        });
    }
    this.memory.lastAction = 'upgrade_move';
}

Creep.prototype.withdraw_move = function withdraw_move(target, resourceType, amount) {
    if (this.memory.lastAction !== 'withdraw_move') {
        this.say('withdraw');
    }
    if (this.withdraw(target, resourceType, amount) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                opacity: 0.5,
                stroke: '#ffaa00'
            }
        });
    }
    this.memory.lastAction = 'withdraw_move';
}

Creep.prototype.findClosestSource = function findClosestSource() {
    var totalEnergy = 0;
    var source = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => {
                if (s.structureType === STRUCTURE_STORAGE && s.store.energy >= 50) {
                    totalEnergy += s.store.energy;
                    return true;
                }
                return false;
            }
        });
    totalEnergy += this.room.energyAvailable;

    if (source) {
        return source;
    } else if (totalEnergy >= 300) {
        source = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy >= 50
        }) || this.pos.findClosestByPath(FIND_SOURCES);
        return source;
    }
    return this.pos.findClosestByPath(FIND_SOURCES)
}

Creep.prototype.obtainClosestSource = function obtainClosestSource(target) {
    if (target) {
        if (target.resourceType) {
            this.pickup_move(target);
        } else if (target.structureType) {
            this.withdraw_move(target, RESOURCE_ENERGY);
        } else {
            this.harvest_move(target);
        }
    }
}
