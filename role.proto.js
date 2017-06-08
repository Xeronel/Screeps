function Role() {
    this.run = function () {};
}

Role.prototype.run = function run(creep) {};
Role.prototype.icon = '';
/** @param {Creep} creep **/
Role.prototype.draw = function draw(creep) {
    var lbl = creep.room.visual.text(
        creep.memory.role,
        creep.pos.x,
        creep.pos.y + 1.2
    );
};

module.exports = Role;
