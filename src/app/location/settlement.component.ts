import { Component, Output, EventEmitter, Inject, Input } from '@angular/core';
import { HttpLocationService } from './http-location.service';
import { Settlement } from '../location/location.model'
import { APP_CONSTANTS, IAppConstants } from '../config';
import { BaseLoader } from '../shared/abstraction/loaderbase.component';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, finalize } from 'rxjs/operators';

const DeliveryAutoShipmetnKey: number = 4; // "Delivery" post office

@Component({
    selector: 'settlement',
    templateUrl: './__mobile__/settlement.component.html'
})
export class SettlementComponent extends BaseLoader {
    private debounceTime: number = 1000;
    private minCharsCount: number = 3;

    @Input() public settlementsListSource: Settlement[] = [];
    @Input() public selectedName: string = "";
    @Input() shipmentKey$: Subject<number> = new Subject<number>();
    public shipmentKey: number;
    public showDropDown: boolean = false;
    public settlementsList: Settlement[] = [];

    public DeliveryMethodId: number = 0;
    @Output() onSettlementChange: EventEmitter<Settlement> = new EventEmitter<Settlement>();
    @Output() onSettlementsRecive: EventEmitter<Array<Settlement>> = new EventEmitter<Array<Settlement>>();
    @Output() onEmptySearchTerm: EventEmitter<string> = new EventEmitter<string>();
    @Output() hideDropdownSettlement: EventEmitter<Settlement> = new EventEmitter<Settlement>();
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(@Inject(APP_CONSTANTS) private _constants: IAppConstants, private _httpLocationService: HttpLocationService) { super(); }

    ngOnInit() {
        this.shipmentKey$.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged()).subscribe(shipmentKey => {
                if (!shipmentKey)
                    return;
                this.shipmentKey = shipmentKey;
                this.loadData('');
            });
    }

    public hideDropdown(): void {
        this.showDropDown = false;
        this.hideDropdownSettlement.emit(this.settlementsList[0] as Settlement);
    }

    public getDisplay(): string {
        return this.showDropDown ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }

    public searchSettlement(term: string): void {
        if (term == "") {
            this.onEmptySearchTerm.emit(term);
        }
        this.loadData(term);
    }

    public onSettlementItemSelect(item: Settlement): void {
        this.showDropDown = false;
        this.onSettlementChange.emit(item);
    }

    public findElemFilter(text: string) {
        this.showDropDown = true;

        if (!text) {
            return this.settlementsListSource;
        }

        return this.settlementsListSource.filter(filter =>
            filter.name.toLowerCase().includes(text.toLowerCase()));
    };

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
    private loadData(term: string) {
        if (term.length >= this.minCharsCount) {
            this.StartSpinning();
            if (this.shipmentKey && this.shipmentKey == DeliveryAutoShipmetnKey) {
                this.settlementsList = this.findElemFilter(term) as Settlement[];
                this.EndSpinning();
                this.showDropDown = true;
            }
            else {
                this._httpLocationService.GetSettlementByName(term, this.shipmentKey, 0)
                    .pipe(finalize(() => this.EndSpinning()))
                    .subscribe((data: Settlement[]) => {
                        this.settlementsList = data;
                        this.showDropDown = true;
                    });
            }
        }
    }
}



