function Role() {}
Role.prototype._run = function () {};
Role.prototype.run = Object.defineProperty(Role.prototype, 'run', {
    get: function () {
        return function run() {
            // If a creep was passed as the first argument
            if (arguments.length > 0 && arguments[0] instanceof Creep) {
                var creep = arguments[0];
                if (creep.spawning && !creep.memory.wasSpawning) {
                    creep.memory.wasSpawning = true;
                } else if (!creep.spawning && creep.memory.wasSpawning) {
                    delete creep.memory.wasSpawning;
                    this.onSpawn(creep);
                }
            }
            this._run.apply(this, arguments)
        }
    },
    set: function set(fn) {
        this._run = fn;
    }
});
Role.prototype._onSpawn = function () {};
Role.prototype.onSpawn = Object.defineProperty(Role.prototype, 'onSpawn', {
    get: function get () {
        return function () {
            if (arguments.length > 0 && arguments[0] instanceof Creep) {
                arguments[0].memory.id = arguments[0].id;
            }
            this._onSpawn.apply(this, arguments);
        };
    },
    set: function (fn) {
        this._onSpawn = fn;
    }
});

Role.prototype.onSpawn = function onSpawn(creep) {};
Role.prototype.onDeath = function onDeath(name, memory) {};
Role.prototype.icon = '';

module.exports = Role;
