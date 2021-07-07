import { Component, Input, Inject, Output, EventEmitter } from "@angular/core";
import { MarkerModel } from "../../google-maps/models/marker";
import { DeliveryPoint } from "../../models/models_adm/delivery-point.model";
import { IAppConstants, APP_CONSTANTS } from "../../config";
import { CenterMapModel } from "../../google-maps/models/CenterMapModel";

@Component({
    selector: 'delivery-point-map',
    templateUrl: './__mobile__/delivery-point-map.component.html'
})
export class DeliveryPointMapComponent {
    @Input() public imgUrl: string = this.constants.G_MAPS.AUTODOC_MARKERS + "marker.png";
    @Input() public zoom: number = 5;
    public totalItems: number = 0;
    @Input() public deliveryPoints: DeliveryPoint[] = [];
    selectedMarker: MarkerModel = new MarkerModel();
    @Output() selectedMarkerChange = new EventEmitter<MarkerModel>();
    @Input() public centerMap: CenterMapModel = new CenterMapModel();

    constructor(@Inject(APP_CONSTANTS) protected constants: IAppConstants) {
    }

    ngOnInit() {
    }

    public selectMarker(marker: MarkerModel) {
        this.selectedMarker = marker;
        this.selectedMarkerChange.emit(marker);
    }

    public getImagePreviewUrl(imageUrl: string) {
        if (imageUrl == '') {
            return '';
        }
        let imageName = imageUrl.split('/').pop();
        let imagePreviewName = "Preview_" + imageName;
        let imagePreviewUrl = imageUrl.replace(imageName, imagePreviewName);
        return imagePreviewUrl;
    }
}