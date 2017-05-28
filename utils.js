var wrapper = {};
wrapper.each = function (fn) {
    var iter = (val, idx, array) => {
        return fn(val, idx, array);
    };

    if (Array.isArray(this.object)) {
        for (var idx = 0; idx < this.object.length; idx++) {
            var val = this.object[idx];
            if (iter(val, idx, this.object) == false) {
                break;
            }
        }
    } else {
        Object.getOwnPropertyNames(this.object).forEach(iter);
    }
};

wrapper.partCost = function () {
    var cost = 0;
    $(this.object).each((s) => {
        cost += BODYPART_COST[s];
    });
    return cost;
};

var $ = function (obj) {
    if (obj) {
        var w = wrapper;
        w.object = obj;
        return w;
    }
};

module.exports = $;
