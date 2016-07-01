module.exports.collectGarbage = function() {
    for(var i in Memory.creeps) {
        if (!Game.creeps[i])
            delete Memory.creeps[i];
    }
    for(var j in Memory.flags) {
        if(!Game.flags[j])
            delete Memory.flags[j];
    }
    for(var h in Memory.rooms) {
        if(!Game.rooms[h])
            delete Memory.rooms[h];
    }
};