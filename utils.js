const profiler = require('screeps-profiler');

var wrapper = {};
wrapper.each = function (fn) {
    var result;
    if (Array.isArray(this.object)) {
        for (var idx = 0; idx < this.object.length; idx++) {
            result = fn(this.object[idx], idx, this.object);
            if (result !== undefined) {
                break;
            }
        }
        return result;
    } else {
        for (var idx in this.object) {
            result = fn(this.object[idx], idx, this.object);
            if (result !== undefined) {
                break;
            }
        }
        return result;
    }
};

wrapper.partCost = function () {
    var cost = 0;
    $(this.object).each((s) => {
        cost += BODYPART_COST[s];
    });
    return cost;
};

wrapper.countHarvestable = function countHarvestable () {
    var source = this.object;
    if (source.room.memory.sources === undefined) {
        source.room.memory.sources = {};
    }
    // Return cached value from memory or calculate it for the first time
    if (source.room.memory.sources[source.id] !== undefined) {
        return source.room.memory.sources[source.id];
    } else {
        var pos = source.pos;
        var tiles = source.room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
        source.room.memory.sources[source.id] = _.filter(tiles, (tile) => tile.type === 'terrain' && tile.terrain !== 'wall').length;
        return source.room.memory.sources[source.id];
    }
};

var $ = function (obj) {
    if (obj) {
        var w = wrapper;
        w.object = obj;
        return w;
    }
};
profiler.registerClass(wrapper, 'wrapper');
module.exports = $;
