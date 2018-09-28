'use strict'

const moment = require('moment');

function Job(hours, minutes, name, func) {
    this.hours = hours;
    this.minutes = minutes;
    this.name = name;
    this.func = func;

    this.determineNextRun = () => {
        this.nextRun = moment();
        this.nextRun.hours(this.hours);
        this.nextRun.minutes(this.minutes)
        if(!!this.lastRan) {
            // todo: this might be subject to errors if this takes a REALLY long time and is on a day edge
            // advance by one day.
            this.nextRun.add(1, 'days');
        }
    }

    this.canRun = () => {
        return moment() >= this.nextRun;
    }

    this.run = () => {
        this.lastRan = moment(); // hack to protect from reentry, might need a state on this class
        try {
            this.func();
        } catch(e) {
            console.log(e);
        } finally {
            this.lastRan = moment();
            this.determineNextRun();
        }
    }

    
    this.determineNextRun();
    this.lastRan = moment();
}

module.exports = Job;