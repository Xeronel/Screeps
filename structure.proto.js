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
