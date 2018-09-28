'use strict'

// Include dotenv
require('dotenv').config();

const Scheduler = require('./scheduler/Scheduler');
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
    scheduler.scheduled(10, 30, "Test", () => {
        let collection = db.collection('users');
        
        collection.find({}).forEach((pilot)=>{
            users.getPilotAffiliation(pilot.characterID, (alliance, corporation)=>{
                try{
                    collection.updateOne({"_id": pilot._id}, {$set:{"alliance": alliance, "corporation":corporation}});
                } catch (err) {
                    //log.error("Scheduler - Updating " + pilot.name + "s affiliation: ", err);
                }
            });
        })
    });
    
    scheduler.process();
});