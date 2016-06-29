/**
 * Created by dmartin on 6/29/2016.
 */
var util = require('util');

var roleBasic = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;} });
        if(targets.length && creep.carry.energy == creep.carryCapacity) {
            var prioritytarget = targets[0];
            for(i = 0; i < targets.length; i++) {
                if(targets[i].structureType == STRUCTURE_SPAWN)
                    prioritytarget = targets[i];
                else if(targets[i].structureType == STRUCTURE_EXTENSION && prioritytarget.structureType != STRUCTURE_SPAWN)
                    prioritytarget = targets[i];
            }
            if(creep.transfer(prioritytarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(prioritytarget);
            }

        }
        else if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        else if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
            if(sources.length) {
                for(i = 0; i < sources.length; i++) {
                    if(util.getCurrentStoreAmount(sources[i]) > 0) {
                        if(sources[i].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[i]);
                        }
                    }
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        }
    }
};

module.exports = roleBasic;