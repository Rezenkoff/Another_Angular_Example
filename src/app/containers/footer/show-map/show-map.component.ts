import { Component, Inject, ViewChild } from '@angular/core';
import { BaseBlockComponent } from '../../../shared/abstraction/base-block.component';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { AgmMap } from '@agm/core';
import { ShowPointOnMapPopupComponent } from '../../../shared/components/show-point-on-map-popup.component';

@Component({
    selector: 'autodoc-show-map',
    templateUrl: './__mobile__/show-map.component.html'
})
export class ShowMapComponent extends BaseBlockComponent  {  

    public imgUrl: string = this.constants.G_MAPS.AUTODOC_MARKERS + "marker.png";
    public zoom: number = 15;
    @ViewChild('showpointonmappopup') _showPointOnMapComponent: ShowPointOnMapPopupComponent;

    @ViewChild('agmMap') agmMap: AgmMap;
    constructor( @Inject(APP_CONSTANTS) protected constants: IAppConstants) {
        super(constants);
    }
}
