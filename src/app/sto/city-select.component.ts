﻿import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from "@angular/core";
import { takeUntil, distinctUntilChanged } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { LocationService } from "../location/location.service";
import { Settlement } from "../location/location.model";

@Component({
    selector: 'city-select',
    templateUrl: './__mobile__/city-select.component.html'
})
export class CitySelectComponent implements OnInit, OnDestroy {
    @Input() initialCityId: number;
    @Input() selectedName: string = null;
    @Input() cityId$: Observable<number> = new Observable<number>();
    @Output() onSettlementSelected: EventEmitter<Settlement> = new EventEmitter<Settlement>();
    public popularSettlements: Settlement[] = [];
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private cityId: number;

    constructor(
        private _locationService: LocationService,
    ) { }

    ngOnInit(): void {
        this.cityId = this.initialCityId;
        this._locationService.locationChanged.pipe(takeUntil(this.destroy$)).subscribe(
            (location) => {
                this.setSettlement(location);
            });
        this.cityId$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(cityId => {
            this.cityId = cityId;
            let selected = this.popularSettlements.find(s => s.id == this.cityId);
            selected = selected || this._locationService.selectedLocation;
            this.setSettlement(selected);
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public onSelectSettlement(settlement: Settlement): void {
        this.setSettlement(settlement);
    }

    public hideDropdownSettlement(settelment: Settlement): void {
        //if (this.selectedName != this.orderModel.OrderDestinationCity.name)
        this.onSelectSettlement(settelment);
        event.stopPropagation();
    }

    public isLastItem(item: Settlement): boolean {
        let result: boolean = true;
        if (this.popularSettlements.length == 0) {
            return result;
        }
        result = (this.popularSettlements.indexOf(item) + 1 == this.popularSettlements.length);
        return result;
    }

    private setSettlement(selected: Settlement): void {
        this.selectedName = selected.name;
        this.onSettlementSelected.emit(selected);
    }
}