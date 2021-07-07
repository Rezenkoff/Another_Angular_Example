import { Component, Input, Inject } from '@angular/core';
import { ApplicabilityItem } from '../models';
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainUrlParser, IUrlParser } from '../../app-root/main-url.parser';
import { ProductDetail } from '../models/product-detail.model';
import { ServerParamsTransfer } from '../../server-params-transfer.service';

@Component({
    selector: 'apply-vehicle',
    templateUrl: './__mobile__/apply-vehicle-tab.component.html',
    styleUrls: ['./__mobile__/styles/apply-vehicle-tab.component__.scss']
})
export class ApplyVehicleTabComponent {
    @Input() productDetails: ProductDetail;
    public searchTextMark: string;
    public searchTextModel: string;
    public selectedMark: ApplicabilityItem = null;
    public selectedModel: ApplicabilityItem = null;
    public modificationsList: Array<ApplicabilityItem> = null;
    public subscription: Subscription;
    public productId: number;

    constructor(
        public serverParamsService: ServerParamsTransfer,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        @Inject(MainUrlParser) private urlParser: IUrlParser,
        private _productService: ProductService,
        private _activatedRoute: ActivatedRoute
    ) { }

    public ngOnInit() {
        this.subscription = this._activatedRoute.params.subscribe(
            params => {
                this.productId = this.urlParser.parseUrlForID(params['urlEnding']).id;
            });
    }


    public getApplicability(): any {
        return this.productDetails ? this.productDetails.applicabilityList : [];
    }

    public getLogo(mark: string): string {
        if (mark == null || mark == undefined)
            return;
        return this.constants.IMAGES.VIN_MODEL_CABINET + mark.toUpperCase() + '.PNG'
    }

    public onMarkSelect(selectedMark: ApplicabilityItem): void {
        this.selectedMark = selectedMark;
        this.modificationsList = null;
    }

    public onModelSelect(selectedModel: ApplicabilityItem): void {
        this.selectedModel = selectedModel;

        this.loadModelModifications();
    }

    public loadModifications(model: any, event: any): void {
        model.showChildModifications = !model.showChildModifications;

        event.stopPropagation();       

        if (!model.loaded) {
            model.loading = true;

            this._productService.getModification(this.productId, model.id).subscribe(modifications => {
                model.loading = false;
                model.loaded = true;
                model.children = modifications as Array<ApplicabilityItem>
            });
        }
    }

    public loadModelModifications(): void {
        this._productService.getModification(this.productId, this.selectedModel.id).subscribe(modifications => {
            this.modificationsList = modifications as Array<ApplicabilityItem>
        });
    }
}