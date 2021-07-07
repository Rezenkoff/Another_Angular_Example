import { Injectable } from '@angular/core';
import { Subscription, timer, interval } from 'rxjs';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: "root"})
export class AuthForgotPassTimeService {

    private blockingTimeInMs: number = 0;
    private timer: Subscription;
    private interval: Subscription;
    private intervalMs: number = 1000;
    public isBlockedButton: boolean = false;
    public countingTime$: Subject<string> = new Subject<string>();

    constructor() { }
    
    private StartCountDown() {
        if(this.blockingTimeInMs > 0) {
            this.isBlockedButton = true;
            this.timer = timer(this.blockingTimeInMs).subscribe(t => this.isBlockedButton = !this.isBlockedButton);
            this.interval = interval(this.intervalMs).subscribe(t => this.countingTime$.next(this.millisToMinutesAndSeconds()));
        }
    }

    public millisToMinutesAndSeconds() : string {
        if(this.blockingTimeInMs <= 0){
            this.interval.unsubscribe();
        }

        var minutes = Math.floor(this.blockingTimeInMs / 60000);
        var sec = ((this.blockingTimeInMs % 60000) / 1000);        
        this.blockingTimeInMs -= this.intervalMs;
        return minutes + ":" + (sec < 10 ? '0' : '') + sec.toFixed(0);
    }

    public setBlockingTime(dateTimeString : string) : void {
        if(this.timer) {
            this.timer.unsubscribe();            
        }

        this.blockingTimeInMs = new Date(dateTimeString).getTime() - new Date().getTime();
        this.StartCountDown();        
    }
}
