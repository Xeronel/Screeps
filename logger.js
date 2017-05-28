function logger(name, level) {
    this.name = name;
    this.level = level;
};
var loggers = {};

// Log Levels
logger.CRITICAL = 50;
logger.ERROR = 40;
logger.WARNING = 30;
logger.INFO = 20;
logger.DEBUG = 10;
logger.NOTSET = 0;

logger.getLogger = function (name, level) {
    level = (typeof level !== 'undefined') ?  level : loggers['root'].level;
    if (name == undefined) {
        return loggers['root'];
    } else if (loggers[name] == undefined) {
        loggers[name] = new logger(name, level);
        return loggers[name];
    } else {
        return loggers[name];
    }
}

logger.prototype.setLevel = function (level) {
    if (level) {
        this.level = level;
        loggers[this.name].level = level;
    }
}

// Log to console
logger.prototype.log = function (msg, level) {
    if (level >= this.level) {
        console.log(this.name + ': ' + msg);
    }
};

logger.prototype.critical = function (msg) {
    this.log(msg, logger.CRITICAL, this);
};
logger.prototype.error = function (msg) {
    this.log(msg, logger.ERROR);
};
logger.prototype.warn = function (msg) {
    this.log(msg, logger.WARNING);
};
logger.prototype.info = function (msg) {
    this.log(msg, logger.INFO);
};
logger.prototype.debug = function (msg) {
    this.log(msg, logger.DEBUG);
};

loggers['root'] = new logger('root', logger.INFO);

module.exports = logger;
