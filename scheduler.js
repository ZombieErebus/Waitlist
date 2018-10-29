'use strict'

// Include dotenv
require('dotenv').config();

const Scheduler = require('./scheduler/scheduler');
const database = require('./dbHandler');
const { data } = require('./setup');
const log = require('./logger');
const momenttz = require('moment-timezone');

// Set global timezone for application
momenttz.tz.setDefault("Etc/UTC");

database.connect(() => {
    const wlog = require('./models/wlog');
    const db = database.db;
    const users = require('./models/users')(data);
    const user = require('./models/user')(data);
    const fleets = require('./models/fleets')(data);

    let scheduler = new Scheduler(1000);  

    /**
     * Clears the waitlist and fleet tables.
     * Cleaning the waitlist for next use
     * 
     * @time 11:00GMT -- Downtime 
     */
    scheduler.scheduled(11, 0, "Waitlist Cleanup", () => {
        const collections = ['waitlist', 'fleets'];

        for(let i = 0; i < collections.length; i++) {
            let collection = db.collection(collections[i]);

            collection.remove({}, (err, docCount) => {
                if(!!err) {
                    console.log("scheduler.WaitlistCleanup: ", err);
                    return;
                    // log.debug("scheduler.WaitlistCleanup: ", err);
                }

                console.log("Waitlist and Fleet Table was cleaned.");
            });
        }

        wlog.clean();
    });

   
    /**
     * Updates the corporation and alliance of every pilot
     * 
     * @time 10:30GMT
     */
    scheduler.every("Update Pilot Affiliation", 3600*1000, () => {
        let collection = db.collection('users');
        
        collection.find({}).forEach((pilot)=>{
            users.getPilotAffiliation(pilot.characterID, (alliance, corporation)=>{
                try{
                    collection.updateOne({"_id": pilot._id}, {$set:{"alliance": alliance, "corporation":corporation}});
                } catch (err) {
                    console.log("Scheduler - Updating " + pilot.name + "s affiliation: ", err);
                }
            });
        })
    });
    

    /**
     * Updates the waitlist for online/offline & Location.
     */
    scheduler.every("Waitlist Backend Task", 10, ()=>{
        let collection = db.collection('waitlist');

        collection.find({}).forEach((waitingPilot)=> {
            //Updates online/offline
            user.isOnline(Number(waitingPilot.characterID), (online)=>{
                if(online){

                    try{
                        collection.updateOne({ '_id': waitingPilot._id }, { $unset: {"offline": 0} });
                    } catch (error) {
                        console.log("Scheduler - Updating " + waitingPilot.name + "s online state: ", err)
                    }                       
                } else {
                    
                    try{
                        collection.updateOne({"_id": waitingPilot._id}, { $set: {
                            "offline": (waitingPilot.offline > -1) ? waitingPilot.offline + 1 : 0
                        } });
                    } catch (error) {
                        console.log("Scheduler - Updating " + waitingPilot.name + "s online state: ", err)
                    }  
                }
            });

            //Updates Location
            user.getLocation(waitingPilot.characterID, waitingPilot.name, (location)=> {
                try{
                    collection.updateOne({"_id": waitingPilot._id}, {$set: {"location": location}});
                } catch (err){
                    console.log("Scheduler - Updating " + waitingPilot.name + "s location: ", err)
                }
            });
        })
    });

    /**
     * Updates the fleet information
     */
    scheduler.every("Fleets Backend Task", 10, ()=>{
        fleets.timer();
    });

    scheduler.process();
});