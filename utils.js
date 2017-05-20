var wrapper = {}
wrapper.each = function (fn) {
    Object.getOwnPropertyNames(this.object).forEach((val, idx, array) => {
        fn(val, idx, array);
    });
}

var $ = function (obj) {
    if (obj) {
        var w = wrapper;
        w.object = obj;
        return w;
    }
};

module.exports = $;
