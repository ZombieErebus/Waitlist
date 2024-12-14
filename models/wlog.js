const db = require('../dbHandler.js').db.collection('waitlist-log');
const setup = require('../setup.js');
const users = require('./users')(setup);
var wlog = exports.wlog = {};

/*
* Return all logs
* @sortBy timestamp
* @limit 28 days
*/
wlog.getData = function(days, cb){
    days = days || 7;
    db.find({"time":{$gte: new Date((new Date().getTime() - (days * 24 * 60 * 60 * 1000)))}}).sort({ "time": -1 }).toArray(function (err, docs) {
        if (err) log.error("get: Error for db.find", { err });
        cb(docs);
    })
}

/*
* Log: User joined waitlist.
* @params: userObject
*/
wlog.joinWl = function(user, type = ''){
    type = type.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
    
    var logObject = {
        "pilot": {
            "characterID": user.characterID,
            "name": user.name
        },
        "action": "Joined Waitlist" + (type != '' ? " (" + type + ")" : ""),
        "class": "info",
        "time": new Date()
    }
    db.insert(logObject);
}

/*
* Log: User self removed.
* @params: userObject
*/
wlog.selfRemove = function(userID){
    users.findAndReturnUser(Number(userID), function(user){
        var logObject = {
            "pilot": {
                "characterID": user.characterID,
                "name": user.name
            },
            "action": "Self Removed",
            "class": "info",
            "time": new Date()
        }
        db.insert(logObject);
    })
}

/*
* Log: System removed user
* @params: userID
* @function: get user object from id
*/
wlog.systemRemoved = function(userID){
    users.findAndReturnUser(Number(userID), function(user){
        var logObject = {
            "pilot": {
                "characterID": user.characterID,
                "name": user.name
            },
            "admin": {
                "characterID": null,
                "name": "SYSTEM"
            },
            "action": "Removed",
            "class": "danger",
            "time": new Date()
        }
        db.insert(logObject);
    })
}

/*
* Log: FC removed user
* @params: userID, adminID
* @function: get user objects from id
*/
wlog.removed = function(userID, adminID){
    users.findAndReturnUser(Number(userID), function(userObject){ 
        users.findAndReturnUser(Number(adminID), function(adminObject){
            var logObject = {
                "pilot": {
                    "characterID": userObject.characterID,
                    "name": userObject.name
                },
                "admin": {
                    "characterID": adminObject.characterID,
                    "name": adminObject.name
                },
                "action": "Removed",
                "class": "danger",
                "time": new Date()
            }
            db.insert(logObject);        
        })
    })
}

/*
* Log: Scheduled clean of waitlist
* @params: 
*/
wlog.clean = function(){
    var logObject = {
        "pilot": {
            "characterID": null,
            "name": null
        },
        "admin": {
            "characterID": null,
            "name": null
        },
        "action": "Cleared Waitlist",
        "class": "danger",
        "time": new Date()
    }
    db.insert(logObject);    
}

/*
* Log: FC invited user
* @params: userID, adminID
* @function: get user objects from id
*/
wlog.invited = function(userID, adminID){
    users.findAndReturnUser(Number(userID), function(userObject){ 
        users.findAndReturnUser(Number(adminID), function(adminObject){
            var logObject = {
                "pilot": {
                    "characterID": userObject.characterID,
                    "name": userObject.name
                },
                "admin": {
                    "characterID": adminObject.characterID,
                    "name": adminObject.name
                },
                "action": "Invited",
                "class": "success",
                "time": new Date()
            }
            db.insert(logObject);        
        })
    })
}

/*
* Log: Removed from Waitlist as in fleet
* @params: userID
* @function: get user objects from id
*/
wlog.removedAsInFleet = function(userID){
    users.findAndReturnUser(Number(userID), function(userObject){ 
        var logObject = {
            "pilot": {
                "characterID": userObject.characterID,
                "name": userObject.name
            },
            "admin": {
                "characterID": null,
                "name": null
            },
            "action": "Removed: In Fleet",
            "class": "warning",
            "time": new Date()
        }
        db.insert(logObject);        
    })
}

/*
* Log: FC alarmed user
* @params: userID, adminID
* @function: get user objects from id
*/
wlog.alarm = function(userID, adminID){
    users.findAndReturnUser(Number(userID), function(userObject){ 
        users.findAndReturnUser(Number(adminID), function(adminObject){
            var logObject = {
                "pilot": {
                    "characterID": userObject.characterID,
                    "name": userObject.name
                },
                "admin": {
                    "characterID": adminObject.characterID,
                    "name": adminObject.name
                },
                "action": "Alarmed",
                "class": "warning",
                "time": new Date()
            }
            db.insert(logObject);
        })
    })
}
module.exports = wlog;
