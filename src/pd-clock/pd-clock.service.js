
export class PomodoroClockService {
    constructor(sessionTime, restTime) {
        this.session = sessionTime;
        this.rest = restTime;
        
        this.startTime = 0;
        this.pauseTime = 0;

        this.newSessionTime = sessionTime;
        this.newRestTime = restTime;

        this.running = false;
    }

    run() {
        if (this.running) {
            return;
        }

        let diff = 0;
        if (this.startTime !== 0 && this.pauseTime !== 0) {
            diff = this.pauseTime - this.startTime;
        }

        this.running = true;
        this.startTime = Date.now() - diff;
    }

    pause() {
        this.running = false;
        this.pauseTime = Date.now();
    }

    reset() {
        this.session = this.newSessionTime;
        this.rest = this.newRestTime;

        this.running = false;
        this.startTime = Date.now();
        this.pauseTime = 0;
    }

    get time() {
        let totalTime = this.session + this.rest;
        let diffMs = (totalTime * 60000 + this.startTime) - Date.now();
        let currentTime = Math.round(diffMs / 1000);
        return currentTime;
    }

    get phaseTime() {
        let currentTime = this.time;
        if (!this.resting) {
            currentTime -= this.restTime * 60;
            if (currentTime < 0) {
                currentTime = 0;
            }
        }
        return currentTime;
    }

    get minutes() {
        return ('0' + Math.floor(this.phaseTime / 60)).substr(-2);    
    }

    get seconds() {
        return ('0' + this.phaseTime % 60).substr(-2);
    }

    get resting() {
        return this.time < this.restTime * 60;
    }

    get finished() {
        return this.time < 0 && this.resting && this.running;
    }

    get sessionTime() { 
        return this.newSessionTime;
    }

    set sessionTime(m) {
        this.newSessionTime = m;
        if (!this.running) {
            this.session = m;
        }
    }

    get restTime() {
        return this.newRestTime;
    }

    set restTime(m) {
        this.newRestTime = m;
        if (!this.running) {
            this.rest = m;
        }
    }
}