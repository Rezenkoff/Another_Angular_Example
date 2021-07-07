import { Component, OnDestroy, Inject, EventEmitter, Input, Output } from "@angular/core";
import { AreaService } from "./area.service";
import { Observable, Subject } from "rxjs";
import { Area } from "./area.model";
import { APP_CONSTANTS, IAppConstants } from "../../config/app-constants";

@Component({
    selector: 'area-list',
    templateUrl: './__mobile__/area-list.component.html'
})
export class AreaListComponent implements OnDestroy {

    @Output() onAreaSelect: EventEmitter<Area> = new EventEmitter<Area>();
    public areas$: Observable<Area[]> = new Observable<Area[]>();
    @Input() public searchString: string = "";
    public showDropDown: boolean = false;
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _areaService: AreaService,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants, 
    ) { }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public findAreas() {        
        this.areas$ = this._areaService.findAreas(this.searchString);
        this.showDropDown = true;
    }

    public selectArea(area: Area): void {
        this.searchString = area.areaName
        this.onAreaSelect.emit(area);
        this.hideDropdown();
    }

    public hideDropdown(): void {
        this.showDropDown = false;
    }

    public getDisplay(): string {
        return this.showDropDown ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }
}