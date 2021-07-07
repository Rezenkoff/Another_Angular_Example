import { Component, Inject, EventEmitter, Output, OnInit, OnDestroy, Input } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'vin-search-input',
    templateUrl: './__mobile__/vin-search-input.component.html',
})
export class VinSearchInputComponent implements OnInit, OnDestroy {

    @Input() isSearching$: Observable<boolean> = new Observable<boolean>();
    @Output() onVinCodeEnter: EventEmitter<string> = new EventEmitter<string>();
    @Output() onGovernmentNumEnter: EventEmitter<string> = new EventEmitter<string>();
    @Output() onInvalidCodeEnter: EventEmitter<string> = new EventEmitter<string>();

    public searchString: string = '';
    private _inputString$: Subject<string> = new Subject<string>();
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
    ) { }

    ngOnInit() {
        this._inputString$.pipe(takeUntil(this._destroy$), debounceTime(1500))
            .subscribe(_ => this.emit());
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public check(): void {
        this._inputString$.next(this.searchString);
    }

    private emit(): void {

        if (!this.searchString) {
            return;
        }
        let str = this.searchString.trim().toUpperCase();
        let containsLetters = new RegExp("[A-Z]");
        let isValidVin = new RegExp(this._constants.PATTERNS['VIN_REGEX']);

        if (containsLetters.test(str) && isValidVin.test(str)) {            
            this.onVinCodeEnter.emit(str);
            return;
        }

        if (this.searchString.length >= 5 && this.searchString.length <= 10) {
            this.onGovernmentNumEnter.emit(str);
        }
        else {
            this.onInvalidCodeEnter.emit(str);
        }
    }
}