const setup = require('../setup.js');
const db = require('../dbHandler.js').db.collection('fleets');
const esi = require('../esi.js').makeAPI();
const user = require('../models/user.js')(setup);
const log = require('../logger.js')(module);
const waitlist = require('./waitlist.js')(setup);
const wlog = require('./wlog.js');
const cache = require('../cache.js')(setup);

module.exports = function (setup) {

    /*
    * Returns a specific fleet
    * @params fleetID (int)
    * @return status
    */
    module.get = function(fleetID, cb){
		db.findOne({ 'id': fleetID }, function (err, doc) {
			if (err) log.error("fleets.get: Error for db.findOne", { err, id });
			if (!!!doc) {
				cb(null, false)
			} else {
				cb(doc, true);
			}
		});
    }

    /*
    * Get a list of fleets
    * @params 
    * @return [ {ID, FC{}, BackFC{}, Status, Type, Comms{}, System{} }]
    */
    module.getFleetList = function(fleets){
        db.find({}).toArray(function(err, docs){
            if(err) {
                log.error("fleet.getFleetList: error getting the list of fleets", err);
                fleets(null);
                return;
            }

            fleets(docs);
        })
    }

    /*
    * Closes the fleet
    * @params fleetID (int)
    * @return status
    */
    module.close = function(fleetID, cb){
        db.remove({id: fleetID}, function (err) {
			if (err){
                log.error("fleet.delete:", { "fleet id: ": fleetID, err });
                cb(400);
                return;
            } 
			cb(200);
		})
    }
    
    /*
    * Make an ESI call to see if we have the correct boss.
    * @params characterID (int), fleetID (int)
    * @return bool
    */
    module.validate = function(characterID, fleetID, cb){
        user.getRefreshToken(characterID, function(accessToken){
            esi.characters(characterID, accessToken).fleet(fleetID).info().then(function(result){
                if(result) cb(true);
            }).catch(function(err){
                console.log(err)
                if(err) cb(false);
            });
        })
    }

    /*
    * Save the fleet Object
    * @params fleetObject{}
    * @return err || null
    */
    module.register = function(fleetObject, cb){
        db.insert(fleetObject, function (err, result) {
            if(err){
                log.error("fleets.register: error for db.insert - ", {"Fleet ID": fleetObject.id, "Fleet Commander": fleetObject.fc.name, err})
                cb(err);
                return;
            }
            cb(null);
        })
    }

    /*
    * Update Backseat Object
    * @params fleetID (int), backseat{}
    * @return err || null
    */
    module.updateBackseat = function(fleetID, backseat, cb){
        let newBackseat = {
            "characterID": backseat.characterID,
            "name": backseat.name
        }

        db.updateOne({id: fleetID}, {$set: {backseat: newBackseat }}, function(err){
            if(err){
                log.error("fleets.updateBackseat: ", {"Backseating FC": backseat.name, err});
                cb(400);
                return;
            }

            cb(200);
        })
    }

    /*
    * Update FC Object
    * @params fleetID (int), fc{}
    * @return err || null
    */
    module.updateCommander = function(fleetID, fc, cb){
        let newFC = {
            "characterID": fc.characterID,
            "name": fc.name
        }

        db.updateOne({id: fleetID}, {$set: {fc: newFC }}, function(err){
            if(err){
                log.error("fleets.updateCommander: ", {"FC": fc.name, err});
                cb(400);
                return;
            }

            cb(200);
        })
    }

    /*
    * Update fleet comms
    * @params fleetID (int), commsURL, commsName
    * @return err || null
    */
    module.updateComms = function(fleetID, commsURL, commsName, cb){
        let comms = {
            "name": commsName,
            "url": commsURL
        }

        db.updateOne({id: fleetID}, {$set: {comms: comms }}, function(err){
            if(err){
                log.error("fleets.updateComms: ", {"FC ID": fleetID, err});
                cb(400);
                return;
            }

            cb(200);
        })      
    }
    
    /*
    * Update the fleet stauts
    * @params fleetID (int), status
    * @return err || null
    */
    module.updateStatus = function(fleetID, status, cb){
        db.updateOne({id: fleetID}, {$set: {status: status }}, function(err){
            if(err){
                log.error("fleets.updateStatus: ", {"fleet ID": fleetID, err});
                cb(400);
                return;
            }

            cb(200);
        })           
    }


    /*
    * Update the fleet type
    * @params fleetID (int), type
    * @return err || null
    */
    module.updateType = function(fleetID, type, cb){
        db.updateOne({id: fleetID}, {$set: {type: type }}, function(err){
            if(err){
                log.error("fleets.updateStatus: ", {"fleet ID": fleetID, err});
                cb(400);
                return;
            }

            cb(200);
        })      
    }


    /*
    * Checks if a given pilot is in a fleet
    * @params characterID (int)
    * @return false || joinedTime
    */
    module.inFleet = function(characterID, cb){
        db.findOne({"members.character_id": characterID}, function (err, doc) {
            if(err){
                log.error("ERROR");
                cb(false);
            }
            if(!!doc){
                var members = doc.members;
                
                for(let i = 0; i < members.length; i++){
                    if(members[i].character_id == characterID){
                        cb(Date.parse(members[i].join_time));
                        return;
                    }
                }
            }
            cb(false);
        })
    }


module.revokeFC = function(id, cb){
    db.updateOne({'id': id}, {$set: {fc: {}}}, function(err, result) {
        if (typeof cb === "function") cb();
    });
}

module.checkForDuplicates = function () {
    db.find({}).toArray(function (err, docs) {
        if (err) log.error("fleet.checkForDuplicates: Error for db.find", { err });
        var members = [];
        //Concat didn't work here for some reason? Weird for loop madness instead
        for (var i = 0; i < docs.length; i++) {
            for (var x = 0; x < docs[i].members.length; x++) {
                members.push(docs[i].members[x].character_id);
            }
        }
        waitlist.get(function (onWaitlist) {
            for (var i = 0; i < onWaitlist.length; i++) {
                var charID = onWaitlist[i].characterID;

                if (members.includes(charID)) {
                    // waitlist.remove(charID, function(result){});
                    waitlist.remove("character", charID, function() {});
                    wlog.removedAsInFleet(charID);
                }
            }
        })
    })
}

module.timer = function lookup() {
    db.find().forEach(function (doc) {
        /*
        * Check to see if we have an FC object.
        * If there is no FC the waitlist is in manual mode.
        * Skip and check the next.
        */
            
        if(doc.fc.characterID){
            module.getMembers(doc.fc.characterID, doc.id, doc, function (members, fleetid, fullDoc) {
                if (members == null) {
                    fleetHasErrored();
                } else {
                    // Members have their ship type returned, so we'll use the background process to gather up the names of the ship
                    // before we update the fleet
                    let shipIds = members.map((member) => {
                        return member.ship_type_id;
                    }).filter((id) => {
                        return !!id;
                    });

                    // Mass query might need to get reworked since it doesn't obey expiration
                    cache.massQuery(shipIds, (results) => {
                        for(let i = 0; i < results.length; i++) {
                            let currentShip = results[i];
                            // Lets make sure that the ship is valid
                            if(!!currentShip) {
                                for(let x = 0; x < members.length; x++) {
                                    if(currentShip.id == members[x].ship_type_id)
                                    {
                                        members[x].ship_name = currentShip.name;
                                    }
                                }
                            }
                        }

                        let characterPromises = members.map(member => {
                            return new Promise( (resolve, reject) => {
                                cache.get(member.character_id, 86400, (doc) => {
                                    member.character_name = doc.name || "Unknown (ESI Miss)";

                                    resolve(member);
                                });
                            });
                        });

                        Promise.all(characterPromises).then((members) => {  
                            db.updateOne({ 'id': fleetid }, { $set: { "members": members, "errors": 0 } }, function (err, result) {
                                if (err) log.error("fleet.timers: Error for db.updateOne", { err, fleetid });
                                module.checkForDuplicates();
                            });
                            
                            user.getLocation(doc.fc.characterID, doc.fc.name, function(location) {
                                db.updateOne({ 'id': doc.id }, { $set: { "location": location } }, function (err, result) {//{$set: {backseat: user}}
                                    if (err) log.error("fleet.getLocation: Error for db.updateOne", { err });
                                });
                            });
                        });
                    });

                }

                function fleetHasErrored() {
                    if (doc.errors < 10) {
                        log.warn(`Fleet under ${fullDoc.fc.name} caused an error.`);
                        db.updateOne({ 'id': fleetid }, { $set: { "errors": fullDoc.errors + 1 || 1 } });
                    } else {
                        log.warn(`Fleet under ${fullDoc.fc.name} has been put into ESI Offline mode. ${fullDoc.fc.name} is no longer the listed FC.`);
                        db.updateOne({ 'id': fleetid }, { $set: { "errors": 0 } });
                        module.revokeFC(fleetid);
                    }
                }
            });
        }
    })
}


    module.getMembers = function(fcID, fleetID, fleetObject, cb){
        user.getRefreshToken(fcID, function(accessToken){
            if (!!!accessToken) {
                log.error("fleets.getMembers: No access token provided");
                console.log(accessToken);
                cb(null, fleetID, fleetObject);
                return;
            }
            esi.characters(fcID, accessToken).fleet(fleetID).members().then(function (members) {
                cb(members, fleetID, fleetObject);
                return;
            }).catch(function (err) {
                log.error("fleets.getMembers: Error for esi.characters ", { err, fcID, fleetID });
                cb(null, fleetID, fleetObject);
                return;
            })
        })
    }



    return module;
}