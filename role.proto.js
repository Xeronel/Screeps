function Role() {
    this.run = function () {};
}

Role.prototype.run = function run(creep) {};
Role.prototype.icon = '';
/** @param {Creep} creep **/

module.exports = Role;
