var wrapper = {}
wrapper.each = function (fn) {
    var iter = (val, idx, array) => {
        fn(val, idx, array);
    }
    if (typeof this.object.forEach === 'function') {
        this.object.forEach(iter);
    } else {
        Object.getOwnPropertyNames(this.object).forEach(iter);
    }
}

var $ = function (obj) {
    if (obj) {
        var w = wrapper;
        w.object = obj;
        return w;
    }
};

module.exports = $;
