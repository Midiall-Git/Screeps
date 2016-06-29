/**
 * Created by dmartin on 6/29/2016.
 */
var util = require('util');
var roleCourier = {
    moving: function(creep) {creep.moveByPath(creep.memory.path);},
    createCourier: function(spawner) {spawner.createCreep([CARRY,CARRY,CARRY,MOVE,MOVE], {role: 'courier',state: 'spawning'});}
};

module.exports = roleCourier;