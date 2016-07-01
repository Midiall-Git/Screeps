var garbageCollector = require('garbage');
var creepController = require('controller.creep');

module.exports.loop = function () {
    //Run garbage collection to clean out memory.
    garbageCollector.collectGarbage();
    //Loop through and run creeps.
    for(var i in Game.creeps) {
        var creep = Game.creeps[i];
        creepController.runCreep(creep);
    }
};