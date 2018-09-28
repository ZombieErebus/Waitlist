'use strict'

function Task(name, interval, func) {
    this.name = name;
    this.interval = interval;
    this.func = func;
    this.lastRan = new Date();

    this.canRun = () => {
        let nextRun = new Date(this.lastRan.valueOf());
        nextRun.setSeconds(nextRun.getSeconds() + this.interval);
        return new Date() >= nextRun;
    }

    this.run = () => {
        this.lastRan = new Date(); // hack to protect from reentry, might need a state on this class
        try {
            this.func();
        } catch(e) {
            console.log(e);
        } finally {
            this.lastRan = new Date();
        }
    }
}

module.exports = Task;