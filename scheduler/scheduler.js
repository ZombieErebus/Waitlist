'use strict'

const Job = require('./job');
const Task = require('./task');


// A basic scheduler that will run in it's own process.
// For jobs, keep them short and simple so they don't starve the other jobs
// in the queue
function Scheduler(resolution) {
    this.jobs = [];
    this.tasks = [];
    this.resolution = resolution || 1000; // in ms

    // Allow for overrides
    if(!!process.env.SCHEDULE_RESOLUTION) {
        this.resolution = process.env.SCHEDULE_RESOLUTION;
    }

    this.every = (name, interval, func) => {
        let t = new Task(name, interval, func);
        this.tasks.push(t);
    }

    // Only use this function if you *really* need something to kick off
    // on a specific time, otherwise, the every() function is better
    this.scheduled = (hours, minutes, name, func) => {
        let j = new Job(hours, minutes, name, func);
        this.jobs.push(j);
    }

    this.process = () => {
        // Loop and check to see if we need to run anything ever second
        // this should keep the processing very low
        setInterval(this.loop.bind(this), this.resolution);
    }

    this.loop = () => {
        for(let i = 0; i < this.tasks.length; i++) {
            let task = this.tasks[i];

            if(task.canRun()) {
                console.log("Running Task - " + task.name)
                // let ms0 = performance.now();
                task.run();
                // let ms1 = performance.now();
                // log.info(`Scheduler.loop - ${task.name} ran succesfully in ${ms1 - ms0}`)
            }
        }

        for(let i = 0; i < this.jobs.length; i++) {
            let job = this.jobs[i];

            if(job.canRun()) {
                console.log("Running Task - " + job.name)
                // let ms0 = performance.now();
                job.run();
                // let ms1 = performance.now();
                // log.info(`Scheduler.loop - ${task.name} ran succesfully in ${ms1 - ms0}`)
            }
        }

    }
}

module.exports = Scheduler;