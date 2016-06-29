/**
 * Created by dmartin on 6/29/2016.
 */
var roleCourier = require('role.courier');


module.exports.popControl = function(spawner){
    var currentCreeps = spawner.room.find(FIND_MY_CREEPS);
    var builders = 0;
    var buildersMax = 2;
    var upgraders = 0;
    var upgradersMax = 2;
    var miners = 0;
    var minersMax = 3;
    var basic = 0;
    var basicMax = 0;
    var courier = 0;
    var courierMax = 2;

    for(i = 0; i < currentCreeps.length; i++) {
        if(currentCreeps[i].memory.role == 'builder')
            builders ++;
        else if(currentCreeps[i].memory.role == 'minerplus' || currentCreeps[i].memory.role == 'miner')
            miners++;
        else if(currentCreeps[i].memory.role == 'upgrader')
            upgraders++;
        else if(currentCreeps[i].memory.role == 'basic')
            basic++;
        else if(currentCreeps[i].memory.role == 'courier')
            courier++;
        else
            console.log("Invalid Creep Role Detected. Please Update Population Script.");
    }

    if(spawner.spawning == null) {
        if(miners < minersMax)
            spawner.createCreep([WORK,WORK,WORK,CARRY,MOVE], {role: 'minerplus',state: 'spawning'});
        else if(upgraders < upgradersMax)
            spawner.createCreep([WORK,CARRY,CARRY,MOVE,MOVE], {role: 'upgrader'});
        else if(builders < buildersMax)
            spawner.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], {role: 'builder'});
        else if(basic < basicMax)
            spawner.createCreep([WORK,WORK,CARRY,MOVE], {role: 'basic'});
        else if(courier < courierMax)
            roleCourier.createCourier(Game.spawns.Spawn1);
    }

};