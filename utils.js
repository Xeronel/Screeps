var wrapper = {};
wrapper.each = function (fn) {
    var iter = (val, idx, array) => {
        fn(val, idx, array);
    };

    if (Array.isArray(this.object)) {
        this.object.forEach(iter);
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
