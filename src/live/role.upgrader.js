/**
 * Created by dmartin on 6/29/2016.
 */
var util = require('util');

var roleUpgrader = {


    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }
        if(!creep.memory.upgrading) {
            var sources = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER
            }});
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
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }

        }
    }
};


module.exports = roleUpgrader;