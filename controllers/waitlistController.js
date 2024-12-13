const setup = require('../setup.js');
const banner = require('../models/waitlistBanner.js')(setup);
const broadcast = require('./broadcastController.js');
const fleets = require('../models/fleets')(setup);
const log = require('../logger.js')(module);
const users = require('../models/users.js')(setup);
const waitlist = require('../models/waitlist.js')(setup);
const wlog = require('../models/wlog.js');

/*
* Render login page OR waitlist page
* @params req{}
* @return res{}
*/
exports.index = function(req, res){
    if(!req.isAuthenticated()){
        res.redirect('/');
        return;
    }

    banner.getLast(function(banner){
        waitlist.checkCharsOnWaitlist(req.user.account.pilots, function(charsOnWl) {                   
            var userProfile = req.user;
            var sideBarSelected = 1;
            res.render('waitlist.njk', {userProfile, sideBarSelected, banner, charsOnWl});
        })
    })
}

/*
* Adds pilot to the waitlist
* @params req{}
* @return res{}
*/
exports.signup = function(req, res){
    if(!req.isAuthenticated()){
        res.redirect('/');
        return;
    }

    //TODO: Add check is pilot whitelisted
    users.findAndReturnUser(Number(req.body.pilot), function(pilot){
        var contact = {
            "xmpp": (!!req.user.settings) ? req.user.settings.xmpp : null,
            "pingTarget": req.user.characterID
        }
        
        var promise = new Promise(function(resolve, reject) {           
            if(req.params.type === "main"){
                resolve({
                    "characterID": pilot.characterID,
                    "name": pilot.name
                });
            } else {
                module.getWaitlistState(pilot.characterID, function(dataResponse){
                    resolve({
                        "characterID": dataResponse.main.characterID,
                        "name": dataResponse.main.name
                    });
                })
            }
        });

        promise.then(function(waitlistMain) {
            waitlist.add(waitlistMain, pilot, req.body.ship, contact, req.user.newbee, function(result){
                wlog.joinWl(pilot, req.params.type);
                res.status(result).send();
            });
        }).catch(function(err){
            log.error(err);
        })
    })
}

/*
* Removes pilot, triggered by the pilot
* @params req{}
* @return res{}
*/
exports.selfRemove = function(req, res){
    if(!req.isAuthenticated()){
        res.redirect('/');
        return;
    }

    waitlist.remove(req.params.type, req.params.characterID, function(result){
        wlog.selfRemove(req.params.characterID);
        req.flash("content", result);
        res.redirect("/");
    })
}

/*
* Admin removal of a pilot
* @params req{}
* @return res{}
*/
exports.removePilot = function(req, res){
    if(!users.isRoleNumeric(req.user, 1)){
        res.status(403).send("Not Authorized");
    }

    waitlist.adminRemove(req.params.characterID, function(cb){
        wlog.removed(req.params.characterID, req.user.characterID);
        res.status(cb).send();
    })
}

/*
* Alarms a pilot
* @params req{}
* @return res{}
*/
exports.alarm = function(req, res){
    if(!users.isRoleNumeric(req.user, 1)){
        res.status(403).send("Not Authorised");
        return;
    }
    broadcast.alarm(req.params.characterID, req.params.fleetID, req.user, "alarm");
    wlog.alarm(req.params.characterID, req.user.characterID);
    res.status(200).send();
}


/*
* Removes all pilots on the waitlist
* @params req{}
* @return res{}
*/
exports.clearWaitlist = function(req, res) {
    if(!users.isRoleNumeric(req.user, 1)){
        res.status(403).send("Not Authorised");
        return;
    }
    
    waitlist.get(function(pilotsOnWaitlist) {
        for (var i = 0; i < pilotsOnWaitlist.length; i++) {
            let charID = pilotsOnWaitlist[i].characterID;
            waitlist.remove("character", pilotsOnWaitlist[i].characterID, function(result){
                wlog.removed(charID, req.user.characterID);
            });
        }
        res.status(200).send();
    })        
}

/**
 * Returns a waitlist state for the user
 * Including:
 * Banner{}
 * Fleets[]
 * Queue{}
 * Pilots{}
 */
exports.pilotWaitlistState = (req, res) => {
    if(!users.isRoleNumeric(req.user, 0)){
        res.status(401).send("Not Authorised");
        return;
    }

    var payload = {
        "banner": {},
        "fleets": [],
        "queue": {},
        "pilots": []
    }

    var payloadPromise = [];

    //Return the active banner || null
    banner.getLast((activeBanner) => {
        payload.banner = activeBanner;
        
        if(!!payload.banner)
            payload.banner.isAdmin = (req.user.role.numeric > 0)? true: false;

        //Returns all of the active fleets
        fleets.getFleetList((fleetList) => {
            for(let i = 0; i < fleetList.length; i++){
                if(fleetList[i].status !== "Not Listed"){
                    payload.fleets.push({
                        "fc": {
                            "name": fleetList[i].fc.name || "",
                            "characterID": fleetList[i].fc.characterID || null
                        },
                        "backseat": {
                            "name": fleetList[i].backseat.name || "",
                            "characterID": fleetList[i].backseat.characterID || null
                        },
                        "type": fleetList[i].type,
                        "status": fleetList[i].status,
                        "size": fleetList[i].members.length,
                        "location": {
                            "name": (fleetList[i].location)? fleetList[i].location.name : "",
                            "systemID": (fleetList[i].location)? fleetList[i].location.systemID : 0,
                        },
                        "comms": {
                            "link": fleetList[i].comms.name || "",
                            "resource": fleetList[i].comms.url || null
                        }
                    });
                }
            }

            module.getWaitlistState(req.user.characterID, (pilotStates) => {
                module.getQueuePos(pilotStates.main.characterID, (theNumbers) => {
                    payload.pilots =  pilotStates;
                    payload.queue = theNumbers;
                    res.status(200).send(payload);
                });
            });   
        });
    });
}


/*
* Returns an object of a users known alts (On waitlist or fleet or else)
* @params req{ pilotID (int) }
* @return res{}
*/
exports.pilotStatus = function(req, res){
    if(!users.isRoleNumeric(req.user, 0)){
        res.status(401).send("Not Authorised");
        return;
    }

    module.getWaitlistState(req.params.characterID, function(pilotStates){
        module.getQueuePos(pilotStates.main.characterID, function(theNumbers){
            pilotStates.queue = theNumbers;
            res.send(pilotStates);
        });
    });
}

/*
* Returns an object of a users known alts (On waitlist or fleet or else)
* @params req{ pilotID (int) }
* @return res{}
*/
module.getWaitlistState = function(characterID, cb){
    //Get main
    users.getAlts(Number(characterID), function(knownPilots) {       
        //Flag pilots that are on the wl with their timestamp
        var onWaitlistPromise = [];
        for(let i = 0; i < knownPilots.length; i++){
            var promise = new Promise(function(resolve, reject) {
                waitlist.isUserPresent(knownPilots[i].characterID, function(timestamp) {
                    if(timestamp){
                        resolve({
                            "characterID": knownPilots[i].characterID,
                            "name": knownPilots[i].name,
                            "onWaitlist": true,
                            "timestamp": timestamp
                        });
                    } else {
                        resolve({
                            "characterID": knownPilots[i].characterID,
                            "name": knownPilots[i].name,
                            "onWaitlist": false
                        });
                    }
                })
            });
            onWaitlistPromise.push(promise);
        }
        
        
        Promise.all(onWaitlistPromise).then(function(pilots) {      
            var promises = pilots.map(function(pilot, index) {
                return new Promise(function(resolve, reject) {
                    if(!pilot.onWaitlist) {
                        fleets.inFleet(pilot.characterID, function(inFleet){
                            if(inFleet){
                                pilot.timestamp = inFleet
                                resolve(pilot);
                            } else {
                                resolve(pilot);
                            }
                        });
                    } else {
                        resolve(pilot);
                    }
                });
            });

            Promise.all(promises).then(function(members) {
                var main = {};


                //Sort in order of signup
                members.sort(function(a,b) {
                    if(!!a.timestamp) return 1;
                    if(a.timestamp < b.timestamp) return 1;
                    return -1;
                })
                
                if(!!members[members.length - 1].timestamp) {
                    main = members.pop();
                }
                
                //Remove timestamps before passing back the json value.
                members.forEach(function(v){ 
                    delete v.timestamp 
                });

                //Sort by name
                members.sort(function(a,b) {
                    if(a.name > b.name) return 1;
                    return -1;
                })
                
                cb({
                    main: main,
                    other: members
                });
            });


        });
    })
}

module.getQueuePos = function(characterID, cb){
    require('../dbHandler.js').db.collection('waitlist').find().sort({ signup: 1 }).toArray(function(err, docs){
        if(err){
            log.error("waitlist.getQueuePos: ", err)
            cb(null);
            return;
        }
    
        var data = {"mainPos":null, "totalMains": 0}
        for(let i = 0; i < docs.length; i++){
            //Number of Mains
            if(docs[i].characterID === docs[i].waitlistMain.characterID) {
                data.totalMains++;
            }

            //Your position
            if(!data.mainPos && characterID === docs[i].characterID) {
                // Is this a main character?
                if(characterID == docs[i].waitlistMain.characterID) {
                    // Main queue
                    data.mainPos = data.totalMains;
                } else {
                    // Alt queue
                    data.mainPos = i + 1;
                }

                continue;
            }
        }

        cb(data);
    });
}