import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from "@angular/core";
import { CatalogType } from "../../catalog/models/catalog-type.enum";
import { Observable, Subscription } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'catalog-type-select',
    templateUrl: './__mobile__/catalog-type-select.component.html'
})
export class CatalogTypeSelectComponent implements OnInit, OnDestroy {

    @Input() catalogType$: Observable<CatalogType> = new Observable<CatalogType>();
    catalogType: CatalogType = CatalogType.Passenger;
    @Output() catalogTypeSelected: EventEmitter<CatalogType> = new EventEmitter<CatalogType>();
    public truckCatalog: boolean = false;
    public passengerCatalog: boolean = false;
    private _sub = new Subscription();

    constructor(public dialogRef: MatDialogRef<CatalogTypeSelectComponent>) {

    }

    ngOnInit() {
        this._sub = this.catalogType$.subscribe(type => {
            this.catalogType = type;
            this.setCatalogType();
        });
        this.setCatalogType();
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    private setCatalogType(): void {
        switch (this.catalogType) {
            case CatalogType.Passenger:
                this.passengerCatalog = true;
                this.truckCatalog = false;
                break;
            case CatalogType.Truck:
                this.truckCatalog = true;
                this.passengerCatalog = false;
                break;
        }
    }

    public selectPassengerCatalog(): void {
        if (this.passengerCatalog) {
            return;
        }
        this.passengerCatalog = true;
        this.truckCatalog = false;
        this.catalogTypeSelected.emit(CatalogType.Passenger);
    }

    public selectTruckCatalog(): void {
        if (this.truckCatalog) {
            return;
        }
        this.truckCatalog = true;
        this.passengerCatalog = false;
        this.catalogTypeSelected.emit(CatalogType.Truck);
    }

    public getTruckBtnClass(): string {
        return (this.truckCatalog) ? "btn-truck active" : "btn-no-active";
    }

    public getPassengerBtnClass(): string {
        return (this.passengerCatalog) ? "btn-passenger active" : "btn-no-active";
    }

    public back() {
        this.dialogRef.close(true);
    }
}