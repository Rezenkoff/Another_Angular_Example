import { SharedModule } from "../../shared/modules/shared.module";
import { CommonModule } from "@angular/common";
import { SharedCommonModule } from "../../shared/modules/shared-common.module";
import { NgModule } from "@angular/core";
import { AgmCoreModule } from "@agm/core";
import { AgmMarkerClustererModule } from '@agm/markerclusterer'


@NgModule({
    imports: [
        SharedCommonModule,
        CommonModule,
        SharedModule,
        AgmCoreModule,
        AgmMarkerClustererModule
    ],
    declarations: [
    ],
    providers: [
    ],
    exports: [
    ]
})

export class DeliveryPointModule { }