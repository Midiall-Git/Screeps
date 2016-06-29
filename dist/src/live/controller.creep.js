/**
 * Created by dmartin on 6/29/2016.
 */
var util = require('util');
var roleMiner = require('role.miner');
var roleCourier = require('role.courier');

/* Courier Controller Script*/
function controlCourier(creep) {

    if(creep.memory.state == 'spawning') {
        if (!creep.spawning) {
            creep.memory.state = 'initializeCollecting';
        }
    }
    else if(creep.memory.state == 'initializeCollecting') {
        var currentRoom = creep.pos.roomName;
        creep.memory.path = Room.serializePath(findCollectionTarget(creep));
        creep.memory.state = 'movingToCollect';
        roleCourier.moving(creep);
    }
    else if(creep.memory.state == 'movingToCollect') {
        roleCourier.moving(creep);
        var targetID = creep.memory.target;
        var targetStructure = Game.getObjectById(targetID);
        if(creep.pos.getRangeTo(targetStructure) < 2)
            creep.memory.state = 'collecting';
    }
    else if(creep.memory.state == 'collecting') {
        var sourceId = creep.memory.target;
        var source = Game.getObjectById(sourceId);
        var transferResult = source.transfer(creep, RESOURCE_ENERGY);
        if(transferResult == ERR_NOT_IN_RANGE) {
            console.log('Not in range of Container. Something went wrong. Reinitializing Collect.');
            creep.memory.state = 'initializeCollecting';
        }
        else if(transferResult == ERR_FULL) {
            console.log('Im already full. Why did I try to collect? Initializing Deposit.');
            creep.memory.state = 'initializingDeposit';
        }
        else if(transferResult == OK) {
            if(creep.carry.energy < creep.carryCapacity) {
            }
            else {
                creep.memory.state = 'initializingDeposit';
            }
        }
    }
    else if(creep.memory.state == 'initializingDeposit') {
        var currentRoom = creep.pos.roomName;
        creep.memory.path = Room.serializePath(findDepositTarget(creep));
        creep.memory.state = 'movingToDeliver';
        roleCourier.moving(creep);
    }
    else if(creep.memory.state == 'movingToDeliver') {
        roleCourier.moving(creep);
        var targetID = creep.memory.target;
        var targetStructure = Game.getObjectById(targetID);
        if(creep.pos.getRangeTo(targetStructure) < 2)
            creep.memory.state = 'deposit';
    }
    else if(creep.memory.state == 'deposit') {
        var sourceId = creep.memory.target;
        var source = Game.getObjectById(sourceId);
        var transferResult = creep.transfer(source, RESOURCE_ENERGY);
        if(transferResult == ERR_NOT_IN_RANGE) {
            creep.memory.state = 'initializingDeposit';
        }
        else if(transferResult == ERR_FULL) {
            creep.memory.state = 'initializingDeposit';
        }
        else if(transferResult == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.state = 'initializeCollecting';
        }
        else if(transferResult == OK) {
            if(creep.carry.energy > 0) {
                creep.memory.state = 'initializingDeposit';
            }
            else {
                creep.memory.state = 'initializeCollecting';
            }
        }
    }
    else {
        console.log('My state is incorrect =(');
    }


}
function findCollectionTarget(creep) {
    var sources = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER }});
    for(i = 0; i < sources.length; i++) {
        if(util.getCurrentStoreAmount(sources[i]) == 0) {
            sources.splice(i, 1);
        }
    }
    if(sources.length) {
        var target = creep.pos.findClosestByPath(sources);
        creep.memory.target = target.id;
        var path = creep.pos.findPathTo(target);
        return path;
    }
    else {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
        creep.memory.target = target.id;
        return creep.pos.findPathTo(target);
    }
}
function findDepositTarget(creep) {

    var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}});
    if(targets.length) {
        var prioritytarget = targets[0];
        for(i = 0; i < targets.length; i++) {
            if(targets[i].structureType == STRUCTURE_SPAWN)
                prioritytarget = targets[i];
            else if(targets[i].structureType == STRUCTURE_EXTENSION && prioritytarget.structureType != STRUCTURE_SPAWN)
                prioritytarget = targets[i];
        }
        creep.memory.target = prioritytarget.id;
        return creep.pos.findPathTo(prioritytarget);
    }
    else {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
        creep.memory.target = target.id;
        return creep.pos.findPathTo(target);
    }
}
/* End Courier Controller Script*/

function controlMiner(creep) {

    if(creep.memory.state == 'spawning') {
        var nodeFlags = creep.room.find(FIND_FLAGS);
        if(nodeFlags.length == 0) {
            placeFlags(creep);
        }

        if (!creep.spawning) {creep.memory.state = 'initializeMining';}
    }
    //Find the node the miner needs to be assigned to. Assign it as target and set path to it. No nodes flagged? Call the room node initialize first.
    else if(creep.memory.state == 'initializeMining') {
        var nodeFlags = creep.room.find(FIND_FLAGS);
        if(nodeFlags[0].memory.nodeid == null) {
            console.log('Flags not initialized. Initializing flags.');
            initializeNodeFlags(creep);
            nodeFlags = creep.room.find(FIND_FLAGS);
        }
        for(i = 0; i < nodeFlags.length; i++) {
            var miners = 0;
            for(var name in Game.creeps) {
                var testCreep = Game.creeps[name];
                if(testCreep.memory.role == 'minerplus') {
                    if(testCreep.memory.nodeid == nodeFlags[i].memory.nodeid)
                        miners ++;
                }
            }
            if(miners < nodeFlags[i].memory.openspots && miners < 3) {
                creep.memory.nodeid = nodeFlags[i].memory.nodeid;
                if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.nodeid)) > 1) {
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(Game.getObjectById(creep.memory.nodeid)));
                    creep.memory.state = 'moveToNode';
                }
                else {
                    creep.memory.state = 'mining';
                }
            }
        }
    }
    //Move to be in range of the node.
    else if(creep.memory.state == 'moveToNode') {
        roleMiner.moving(creep);
        var targetID = creep.memory.nodeid;
        var targetNode = Game.getObjectById(targetID);
        if(creep.pos.getRangeTo(targetNode) < 2)
            creep.memory.state = 'mining';
    }
    //In range of node. Start mining.
    else if(creep.memory.state == 'mining') {
        var result = creep.harvest(Game.getObjectById(creep.memory.nodeid));
        if(result == ERR_NOT_IN_RANGE) {
            console.log('Im not in range of the node! What happened? Moving there now.');
            creep.memory.state = 'moveToNode';
        }
        if(creep.carry.energy == creep.carryCapacity) {
            if(creep.memory.depositid == null) {
                console.log('Depost id not set. Finding Container.');
                creep.memory.state = 'initializeDeposit';
            }
            else if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.depositid)) > 1) {
                creep.memory.path = Room.serializePath(creep.pos.findPathTo(Game.getObjectById(creep.memory.depositid)));
                creep.memory.state = 'moveToDeposit';
            }
            else {
                creep.memory.state = 'deposit';
            }
        }

    }
    //Pack is full for fist time. Need to set the deposit memory object.
    else if(creep.memory.state == 'initializeDeposit') {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
        creep.memory.depositid = target.id;
        if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.depositid)) > 1) {
            creep.memory.path = Room.serializePath(creep.pos.findPathTo(Game.getObjectById(creep.memory.depositid)));
            creep.memory.state = 'moveToDeposit';
        }
        else {
            creep.memory.state = 'deposit';
        }
    }
    //if too far away move to deposit
    else if(creep.memory.state == 'moveToDeposit') {
        roleMiner.moving(creep);
        var targetID = creep.memory.depositid;
        var targetNode = Game.getObjectById(targetID);
        if(creep.pos.getRangeTo(targetNode) < 2)
            creep.memory.state = 'deposit';
    }
    //Deposit the goods. If deposit is full wait. AFter deposit check for distance to node and act accordingly. moveToNode if too far away mining if not.
    else if(creep.memory.state == 'deposit') {
        var depositTarget = Game.getObjectById(creep.memory.depositid);
        var resut = creep.transfer(Game.getObjectById(creep.memory.depositid), RESOURCE_ENERGY);
        if(result == ERR_FULL) {
            console.log('Container is full. Sleeping until next tick. Make more carriers!');
        }
        else if(result == ERR_NOT_IN_RANGE) {
            console.log('Im not in range of this container. What happened? Moving to it.');
            creep.memory.state = 'moveToDeposit';
        }
        else {
            if(creep.carry.energy > 0) {}
            else if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.nodeid)) > 1) {
                creep.memory.path = Room.serializePath(creep.pos.findPathTo(Game.getObjectById(creep.memory.nodeid)));
                creep.memory.state = 'moveToNode';
            }
            else {
                creep.memory.state = 'mining';
            }
        }
    }
}

function placeFlags(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    if(sources) {
        console.log( sources.length + ' Sources found. Placing flags.');
        for(i = 0; i < sources.length; i++) {
            var checkId = sources[i].id;
            console.log('checkId set to: ' + checkId);
            console.log('Checking source with id=' + checkId);
            var sourceObject = Game.getObjectById(checkId);
            var position = sourceObject.pos;
            var flagName = 'Node: ' + i;
            console.log('Placing Flag');
            var newFlagName = creep.room.createFlag(position, flagName, COLOR_YELLOW);
            console.log(newFlagName + ': newFlagName');
        }
    }
}
function initializeNodeFlags(creep) {

    var nodeFlags = creep.room.find(FIND_FLAGS);
    var sources = creep.room.find(FIND_SOURCES);
    console.log('nodeFlags Length: ' + nodeFlags.length);
    for(i = 0; i < nodeFlags.length; i++) {
        var newFlag = nodeFlags[i];
        var checkId = sources[i].id;
        console.log('Initializing Flag: ' + newFlag);
        console.log('Flag Info: ' + newFlag.name + 'in room: '+ newFlag.room);
        console.log('Creating test area.');
        var testArea = newFlag.room.lookAtArea((newFlag.pos.y - 1), (newFlag.pos.x - 1), (newFlag.pos.y + 1),(newFlag.pos.x + 1), true);
        var openSpots = 0;
        for(j = 0; j < testArea.length; j++) {
            console.log('testing testarea of'+ testArea[j].terrain);
            if(testArea[j].terrain == 'plain' || testArea[j].terrain == 'swamp')
                openSpots ++;
        }
        newFlag.memory.openspots = openSpots;
        newFlag.memory.nodeid = checkId;
    }
}


module.exports = {

    processCreeps: function() {

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'courier') {
                controlCourier(creep);
            }
            if(creep.memory.role == 'minerplus') {
                controlMiner(creep);
            }

        }

    },


};