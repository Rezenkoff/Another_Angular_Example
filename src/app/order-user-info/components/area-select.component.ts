import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { AreaService } from "../../location/area/area.service";
import { Observable, Subject } from "rxjs";
import { Area } from "../../location/area/area.model";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";

@Component({
    templateUrl: './__mobile__/area-select.component.html',
    selector: 'area-select',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaSelectComponent implements OnInit, OnDestroy {

    @Input() areaId$: Observable<number> = new Observable<number>();
    @Output() areaSelected: EventEmitter<Area> = new EventEmitter<Area>();
    public popularAreas$: Observable<Area[]> = new Observable<Area[]>();
    public selectedAreaName: string = "";
    private _areas: Area[] = [];
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    private _areaId: number = null;

    constructor(
        private _areaService: AreaService
    ) { }

    ngOnInit() {
        this.popularAreas$ = this._areaService.getPopularAreas();
        this.popularAreas$.pipe(takeUntil(this._destroy$)).subscribe(areas => {
            this._areas = areas;
        });
        this.areaId$.pipe(takeUntil(this._destroy$), distinctUntilChanged()).subscribe(areaId => {
            if (!areaId || areaId == this._areaId) {
                return;
            }
            this._areaService.getAreaById(areaId).subscribe(area => {
                if (area) {
                    this.selectArea(area);
                }
            })
        });
        this._areaService.areaChanged.pipe(takeUntil(this._destroy$), distinctUntilChanged()).subscribe(area => {
            this.selectArea(area);
        });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public selectArea(area: Area): void {
        this.selectedAreaName = area.areaName;
        this._areaId = area.areaId;
        this.areaSelected.emit(area);
    }

    public isLastItem(area: Area): boolean {
        let result: boolean = true;
        if (this._areas.length == 0) {
            return result;
        }
        result = (this._areas.indexOf(area) + 1 == this._areas.length);
        return result;
    }
}