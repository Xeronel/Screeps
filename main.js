var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
     for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var roles = {'harvester': 2, 'upgrader': 1, 'builder': 1}
    Object.getOwnPropertyNames(roles).forEach(function (role) {
        var population = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (population.length < roles[role]) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: role });
            console.log('Spawned ' + role + ': ' + newName);
        }
    });

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
