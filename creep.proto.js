Creep.prototype.harvest_move = function (target) {
    if (this.harvest(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {
            visualizePathStyle: {
                stroke: '#ffaa00'
            }
        })
    }
}
