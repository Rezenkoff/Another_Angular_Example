import { Component, OnInit, Inject, OnDestroy, PLATFORM_ID, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { isPlatformServer } from '@angular/common';
import { AreaService } from "./area.service";
import { Observable, Subject } from "rxjs";
import { Area } from "./area.model";
import { BaseBlockComponent } from "../../shared/abstraction/base-block.component";
import { APP_CONSTANTS, IAppConstants } from "../../config/app-constants";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'settlement-area',
    templateUrl: './__mobile__/settlement-area.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent extends BaseBlockComponent implements OnInit, OnDestroy 
{
    public areas$: Observable<Area[]> = new Observable<Area[]>();
    public selectedArea: Area = new Area();
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild('location')
    public locationRef: ElementRef;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_CONSTANTS) _constants: IAppConstants,
        private _areaService: AreaService,
        private cd: ChangeDetectorRef
    ) { super(_constants); }

    ngOnInit() {
        this.areas$ = this._areaService.getPopularAreas().pipe(takeUntil(this._destroy$));
        this._areaService.getSelectedArea().pipe(takeUntil(this._destroy$)).subscribe(area => {
            this.selectedArea = area;
            this.cd.detectChanges();
        });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public selectArea(area: Area): void {
        this._areaService.setSelectedArea(area);
        this.hideWindow();
    }

    public isBrowser(): boolean {
        return !isPlatformServer(this.platformId);
    }
}
