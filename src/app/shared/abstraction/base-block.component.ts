import { Component, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'base-box',
    template: ''
})
export class BaseBlockComponent {
    constructor( @Inject(APP_CONSTANTS) protected constants: IAppConstants) { }

    public isShowDropDown: boolean = false;
    public isShowDropDown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isShowDropDown);

    public toggleWindow(event?: any): void {
        this.setNewShowValue(!this.isShowDropDown);

        if (event) {
            event.stopPropagation();
        }
    }

    public hideWindow(): void {
        this.setNewShowValue(false);
    }

    public showDropDown(): string {
        return this.isShowDropDown ? this.constants.STYLING.DISPLAY_BLOCK : this.constants.STYLING.DISPLAY_NONE;
    }

    private setNewShowValue(value: boolean) {
        this.isShowDropDown = value;
        this.isShowDropDown$.next(value);
    }
}
