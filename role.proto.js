function Role() {
    this.run = function () {};
}

Role.prototype.run = function (creep) {};
/** @param {Creep} creep **/
Role.prototype.draw = function (creep) {
    var lbl = creep.room.visual.text(
        creep.memory.role,
        creep.pos.x,
        creep.pos.y + 1.2
    );
};

module.exports = Role;
