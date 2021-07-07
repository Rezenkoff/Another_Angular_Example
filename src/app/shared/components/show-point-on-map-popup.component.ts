import { Component, Input, Inject } from "@angular/core";
import { IAppConstants, APP_CONSTANTS } from "../../config";
import { BaseBlockComponent } from "../../shared/abstraction/base-block.component";

@Component({
    selector: 'show-point-on-map-popup',
    templateUrl: './__mobile__/show-point-on-map-popup.component.html'
})
export class ShowPointOnMapPopupComponent extends BaseBlockComponent {

    @Input() public iconUrl: string = 'marker.png';
    @Input() public zoom: number = 10;
    @Input() public latitudePoint: number = 0;
    @Input() public longitudePoint: number = 0;
    @Input() public latitudeCenter: number = 0;
    @Input() public longitudeCenter: number = 0;

    constructor(@Inject(APP_CONSTANTS) protected constants: IAppConstants) {
        super(constants);
    }

    public getIconUrl() {
        return this.constants.G_MAPS.AUTODOC_MARKERS + this.iconUrl;
    }

    ngOnInit() {
    }
}