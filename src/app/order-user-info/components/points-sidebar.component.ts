import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, AfterViewInit } from "@angular/core";
import { DeliveryPointGeocoded } from "../../delivery/points/delivery-point-geocoded.model";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { takeUntil, distinctUntilChanged } from "rxjs/operators";
import { ScrollService } from "../../services/scroll.service";
import { ServerParamsTransfer } from '../../server-params-transfer.service';

@Component({
    selector: 'points-sidebar',
    templateUrl: './__mobile__/points-sidebar.component.html'
})
export class PointsSidebarComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() points$: Observable<DeliveryPointGeocoded[]> = new Observable<DeliveryPointGeocoded[]>();
    @Input() selectedPointKey$: Observable<string> = new Observable<string>();
    @Input() deliveryMethodKey$: Observable<string> = new Observable<string>();
    @Output() pointSelected: EventEmitter<DeliveryPointGeocoded> = new EventEmitter<DeliveryPointGeocoded>();
    @Output() pointActivated: EventEmitter<DeliveryPointGeocoded> = new EventEmitter<DeliveryPointGeocoded>();

    private _allPoints: DeliveryPointGeocoded[] = [];
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    public filteredList$: BehaviorSubject<DeliveryPointGeocoded[]> = new BehaviorSubject<DeliveryPointGeocoded[]>([]);
    public activePointKey: string = null;
    public searchTerm: string = "";

    constructor(private serverParamsService: ServerParamsTransfer, private _scrollService: ScrollService) { }

    ngOnInit() {
        this.points$.pipe(takeUntil(this._destroy$)).subscribe(points => {
            this._allPoints = points;
            this.filteredList$.next(points);
            this.scrollToSelected();
        });

        this.selectedPointKey$.pipe(takeUntil(this._destroy$), distinctUntilChanged()).subscribe(key => {
            this.activePointKey = key;
            this.scrollToSelected();
        });
    }

    ngAfterViewInit() {
        this.scrollToSelected();
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public filter(): void {
        if (!this.searchTerm) {
            this.filteredList$.next(this._allPoints);
        }

        const searchString = this.searchTerm.toLowerCase();
        const filtered = this._allPoints.filter(x =>
            x.addressRus.toLowerCase().includes(searchString)
            || x.addressUkr.toLowerCase().includes(searchString)
            || x.shortNameRus.toLowerCase().includes(searchString)
            || x.shortNameUkr.toLowerCase().includes(searchString)
        );

        this.filteredList$.next(filtered);
    }

    public activate(point: DeliveryPointGeocoded): void {
        this.activePointKey = point.refKey;
        this.pointActivated.emit(point);
    }

    public selectPoint(point: DeliveryPointGeocoded): void {
        this.pointSelected.emit(point);
    }

    public isActive(point: DeliveryPointGeocoded): boolean {
        return point.refKey == this.activePointKey;
    }

    public trackByFn(index, item) {
        return index;
    }

    private scrollToSelected(): void {
        if (!this.activePointKey || this.serverParamsService.serverParams.isMobileDevice) {
            return;
        }
        setTimeout(() => this._scrollService.scrollToElement(this.activePointKey), 500);        
    }
    public navigate(point) {
        var browserurl = 'http://www.google.com/maps/place/' + point.latitude + ',' + point.longitude;
        window.open(browserurl, "_blank");
    }
}