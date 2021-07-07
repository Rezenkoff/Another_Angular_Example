import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarFilterRequestParameters } from 'src/app/car-select-panel/models/car-filter-request-parameters.model';
import { CarSelectPanelService } from 'src/app/car-select-panel/services/car-select-panel.service';

@Component({
    selector: 'modifications-info-block',
    templateUrl: './__mobile__/modifications-info-block.component.html',
})
export class ModificationsInfoBlockComponent implements OnInit {

    public isDataLoaded: boolean = false;

    public modifications: string[] = [];
    public years: number[] = [];
    public engines: string[] = [];

    @Input() categoryTitle: string = '';
    @Input() selectedFilters: any = null;

    private subscriptions: Array<Subscription> = new Array<Subscription>();

    constructor(private _carService: CarSelectPanelService) { }

    ngOnInit() {
        if (this.selectedFilters["SuitableVehicles_Mark"]?.selectedOptions?.length 
        && this.selectedFilters["SuitableVehicles_Serie"]?.selectedOptions?.length) {

            let params = new CarFilterRequestParameters();
            params.markKey = this.selectedFilters["SuitableVehicles_Mark"]?.selectedOptions[0]?.key;
            params.serieKey = this.selectedFilters["SuitableVehicles_Serie"]?.selectedOptions[0].key;

            this.initData(params);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private initData(params) {
        this.subscriptions.push(
            this._carService.getModifsBySerie(params).subscribe(models => {
                if (models.length) {
                    this.modifications = [...new Set(models.map(x => x.modelName.trim()))];
                    this.engines = [...new Set(models.map(x => x.typeName.trim()))];

                    let start = Math.min(...models.map(x => x.productionStart)), end = Math.max(...models.map(x => x.productionStart));
                    this.years = new Array(end - start + 1).fill(0).map((_, idx) => start + idx);
                    this.isDataLoaded = true;
                }
            })
        );
    }
}