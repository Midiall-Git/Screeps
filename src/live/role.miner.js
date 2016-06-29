/**
 * Created by dmartin on 6/29/2016.
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */
var util = require('util');

module.exports.run = function(creep){
    if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else if(creep.carry.energy == creep.carryCapacity) {
        var targets = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
        if(targets.length) {
            var transferTarget = targets[0];
            for(i = 0; i < targets.length; i++) {
                if(util.getCurrentStoreAmount(targets[i]) < util.getCurrentStoreAmount(transferTarget))
                    transferTarget = targets[i];
            }
            if(creep.transfer(transferTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(transferTarget);
            }
        }
        else
            console.log("No Transfer Targets.");
    }

};
module.exports.moving = function(creep) {creep.moveByPath(creep.memory.path);};
