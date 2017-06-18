var roleUpgrader = require('role.upgrader');
var Role = require('role.proto');
var logger = require('logger');
var $ = require('utils');
const profiler = require('screeps-profiler');

var roleBuilder = new Role();
roleBuilder.log = logger.getLogger('RoleBuild');

roleBuilder.run = function run(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
    }
    if (!creep.memory.building && creep.totalCarry == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if (creep.memory.building) {
        this.build(creep);
    } else {
        var source = creep.findClosestSource();
        creep.obtainClosestSource(source);
    }
};

roleBuilder.build = function build(creep) {
    if (creep.memory.target === undefined) {
        creep.memory.target = {};
    }
    // Target will be null if construction was completed
    // or a previous target was not set
    var target = Game.getObjectById(creep.memory.target.id);

    // Get a new target
    if (!target) {
        this.triggerOnConstruct(creep);
        target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    }

    if (target) {
        creep.memory.target = {
            id: target.id,
            type: target.structureType,
            pos: target.pos
        };
        creep.build_move(target);
    } else {
        roleUpgrader.run(creep);
    }
};

roleBuilder.triggerOnConstruct = function triggerOnConstruct(creep) {
    // If creep had a previous target try to call it's onConstruct function
    if (creep.memory.target.id) {
        var targetMem = creep.memory.target;
        var structures = _.filter(
            creep.room.lookForAt(LOOK_STRUCTURES, targetMem.pos.x, targetMem.pos.y),
            (s) => {
                return s.structureType === targetMem.type &&
                    s.triggers === true &&
                    s.memory.constructed !== true;
            }
        );
        $(structures).each((s) => {
            s.onConstruct();
        });
        creep.memory.target = {};
    }
};

roleBuilder.icon = "🔨";
profiler.registerClass(roleBuilder, 'roleBuilder');
module.exports = roleBuilder;
