


module.exports.run = function(creep, roomState) {
    var creepState = creep.memory.state;
    //TODO: finish this shit.
    
};
module.exports.spawn = function(spawn) {
    var totalEnergy = spawn.energyCapacityAvailable - 200;
    var creepConfig = [WORK, CARRY, MOVE];
    for(totalEnergy; totalEnergy > 100; totalEnergy = totalEnergy - 100) {
        creepConfig.unshift(WORK);
    }
    var createCheck = spawn.canCreateCreep(creepConfig);
    switch (createCheck) {
        case ERR_BUSY:
            console.log('ERROR: ' + spawn.name +' tried to spawn a creep but returned busy. Did you manually create a creep on me?');
            break;
        case ERR_NOT_ENOUGH_ENERGY:
            if(Game.memory.debug == 'true')
                console.log('DEBUG: '+ spawn.name +' tried to spawn a creep but returned NOT ENOUGH ENERGY.');
            break;
        case ERR_INVALID_ARGS:
            console.log('ERROR: ' + spawn.name +' tried to spawn a creep that returned INVALID ARGS.');
            break;
        case OK:
            if(Game.memory.debug == 'true')
                console.log('DEBUG: Spawn check for '+ spawn.name +' returned OK. Proceeding to spawn creep.');
            let debugSpawnResponse = spawn.createCreep(creepConfig, {role: 'miner',state: 'spawning'});
            if(Game.memory.debug == 'true')
                console.log('DEBUG: Spawn response from ' + spawn.name + ' returned ' + debugSpawnResponse);
    }
};