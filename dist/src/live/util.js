/**
 * Created by dmartin on 6/29/2016.
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    getCurrentStoreAmount: function(theStore) {

        if(!theStore.store)
        {
            return 0;
        }
        var amount = 0;
        for(var test in theStore.store)
        {
            amount += theStore.store[test];
        }
        return amount;
    }
};
    