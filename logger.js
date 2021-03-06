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
logger.levels = {};
logger.levels[logger.CRITICAL] = 'CRITICAL';
logger.levels[logger.ERROR] = 'ERROR';
logger.levels[logger.WARNING] = 'WARNING';
logger.levels[logger.INFO] = 'INFO';
logger.levels[logger.DEBUG] = 'DEBUG';
logger.levels[logger.NOTSET] = 'NOTSET';

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

logger.prototype.getLevelName = function (level) {
    var name = logger.levels[level];
    if (name) {
        return name;
    } else {
        return level;
    }
}

logger.prototype.setLevel = function (level) {
    this.level = level;
    loggers[this.name].level = level;
}

// Log to console
logger.prototype.log = function (msg, level) {
    if (level >= this.level) {
        console.log(`[${this.name}:${arguments.callee.caller.caller.name}:${this.getLevelName(level)}] ${msg}`);
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

logger.log = function (msg, level) {
    loggers['root'].log(msg, level);
};
logger.critical = function (msg) {
    loggers['root'].critical(msg);
};
logger.error = function (msg) {
    loggers['root'].error(msg, logger.ERROR);
};
logger.warn = function (msg) {
    loggers['root'].warn(msg, logger.WARNING);
};
logger.info = function (msg) {
    loggers['root'].info(msg, logger.INFO);
};
logger.debug = function (msg) {
    loggers['root'].debug(msg, logger.DEBUG);
};

loggers['root'] = new logger('root', logger.INFO);

module.exports = logger;
