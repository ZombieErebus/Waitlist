const setup = require('../setup');
const fleets = require('../models/fleets.js')(setup);
const users = require('../models/users.js')(setup);

/*
* Sends an HTML notification to the user
* @params targetID (int), fleetID (int), sender{}, alarmType (sting)
*/
exports.alarm = function(targetID, fleetID, sender, type){   
    fleets.get(fleetID, function(fleet){
        users.findAndReturnUser(Number(targetID), function(user){
            const longpoll = require("express-longpoll")(require('express'));
            longpoll.publishToId("/poll/:id", (user.account.main)? user.characterID : user.account.mainID, {                
                target: user.name,
                sender: sender.name,
                invite: (type == "alarm")? false : true,
                fleet: fleet.comms.name,
                comms: fleet.comms.url,
            });
        })
    })    
}