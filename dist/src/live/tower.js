/**
 * Created by dmartin on 6/29/2016.
 */
var tower = {

    run: function(structuretower) {
        if(structuretower.energy > 9) {
            var enemies = structuretower.room.find(FIND_HOSTILE_CREEPS);
            if(enemies.length > 0) {
                structuretower.attack(enemies[0]);
            }
            else {
                var targets = structuretower.room.find(FIND_STRUCTURES)
                for(i = 0; i < targets.length; i++) {
                    if(targets[i].hits == targets[i].hitsMax || targets[i].hits > 350000) {
                        targets.splice(i, 1);
                        i--;
                    }
                }
                if(targets.length) {
                    var prioritytarget = targets[0];
                }
                else
                    return;
                for(i = 0; i < targets.length; i++) {
                    if(targets[i].hits < prioritytarget.hits) {
                        prioritytarget = targets[i];
                    }
                }
                structuretower.repair(prioritytarget);
            }
        }
    }
}


module.exports = tower;