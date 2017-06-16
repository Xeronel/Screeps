function Role() {}
Role.prototype._run = function () {};
Object.defineProperty(Role.prototype, 'run', {
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
Role.prototype.onSpawn = function onSpawn(creep) {};
Role.prototype.onDeath = function onDeath(name) {};
Role.prototype.icon = '';

module.exports = Role;
