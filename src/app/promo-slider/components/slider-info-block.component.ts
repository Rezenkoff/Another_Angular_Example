import { Component, Input, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
    trigger,
    style,
    transition,
    animate,
    keyframes
} from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { timer } from 'rxjs';

@Component({
    selector: 'slider-info-block',
    templateUrl: './__mobile__/slider-info-block.component.html',
    animations: [
        trigger('showSlide', [
            transition('void => *', [
                animate(8000, keyframes([
                    style({ opacity: 0.1 }),
                    style({ opacity: 1 }),
                    style({ opacity: 1 }),
                    style({ opacity: 1 }),
                    style({ opacity: 1 }),
                    style({ opacity: 0.1 })
                ]))
            ]),
        ])
    ]
})
export class SliderInfoBlockComponent  {

    @Input() indicatorShown$: Observable<boolean> = new Observable<boolean>();
    public selectedBlock: number = 0;
    @Output() changeBlock: EventEmitter<number> = new EventEmitter<number>();
    private pointerTimer: Subscription = new Subscription();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    public selectBlock(blockNumber: number): void {
        this.selectedBlock = blockNumber;
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.goSlide();
        }
    }
 
    private goSlide(): void  {
       this.startTimer();
    }
    
    startTimer() {
        const source = timer(1000, 8000);
        this.pointerTimer = source.subscribe(() => {
            if (this.selectedBlock == 3) {
                this.selectedBlock = 1;
                this.changeBlock.emit(1);
            } else {
                this.selectedBlock++;
                this.changeBlock.emit(this.selectedBlock);
            }
        });     
    }

    ngOnDestroy() {
        this.pointerTimer.unsubscribe();
    }
}