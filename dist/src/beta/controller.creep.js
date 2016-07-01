var roleMiner = require('creep.miner');


module.exports.runCreep = function(creep) {
    //Getting the room state.
    var roomState = creep.room.memory.state;
    //Processing creep with appropriate function.
    switch (creep.memory.role) {
        case 'miner':
            roleMiner.run(creep, roomState);
            break;
        default:
            console.log('Unknown creep role identified. Please update controller.');
    }
    
    
};