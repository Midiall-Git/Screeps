/**
 * Created by dmartin on 6/29/2016.
 */
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleBasic = require('role.basic');
var tower = require('tower');
var population = require('population');
var creepControl = require('controller.creep');

module.exports.loop = function () {

    //Keep memory clear of dead creeps.
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    for(var i in Memory.flags) {
        if(!Game.flags[i]) {
            delete Memory.flags[i];
        }
    }
    population.popControl(Game.spawns.Spawn1);
    creepControl.processCreeps();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'basic') {
            roleBasic.run(creep);
        }
    }
    for(var id in Game.structures) {
        var runningstructure = Game.structures[id];
        if(runningstructure.structureType == 'tower') {
            tower.run(runningstructure);
        }
    }
}