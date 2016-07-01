var roleMiner = require('creep.miner');

function verifyRoom(spawn, rcl, numSources) {
    spawn.room.memory.popchecktimer = Game.time;
    var targetNumber;
    targetNumber += numSources;
    switch (rcl) {
        case 1:
            //TODO: Finish this shit.

    }
}


module.exports.makeBabies = function(spawn) {
    var rcl = spawn.room.controller.level;
    var sources = spawn.room.memory.sources;
    var spawnQueue = spawn.room.memory.spawnqueue;
    //Check if the spawner is spawning a creep currently. If it is return because there is no point in moving forward.
    if(spawn.spawning != null)
        return;

    //Check to see if there is something to spawn. If not check to see if it is time to verify room numbers.
    if(spawnQueue.length < 1)
        if((spawn.room.memory.popchecktimer + 10) == Game.time)
            verifyRoom(spawn, rcl, sources.length);
        else
            return;

    switch (spawnQueue[0]) {
        case 'miner':
            roleMiner.spawn(spawn);

    }
};
