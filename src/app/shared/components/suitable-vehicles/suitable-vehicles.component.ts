import { Component, Inject, Input } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { ProductService } from '../../../product/product.service';
import { ProductDetail } from '../../../product/models';
import { BaseLoader } from '../../abstraction/loaderbase.component';

@Component({
    selector: 'suitable-vehicles',
    templateUrl: './__mobile__/suitable-vehicles.component.html'
})

export class SuitableVehiclesComponent extends BaseLoader {
    vehicles: Array<string> = new Array<string>();
    showView: boolean = false;
    @Input() productId: number;

    constructor(@Inject(APP_CONSTANTS) private _constants: IAppConstants, private _productService: ProductService) {
        super();
    }

    public showSuitabelVehicles(): void {
        if (this.vehicles.length <= 0)
            this.loadSuitableVehicles();
        this.showView = !this.showView;
    }

    getDisplay(): string {
        return this.showView ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }

    private loadSuitableVehicles(): void {
        this.StartSpinning();
        this._productService.getProductDetails(this.productId).subscribe((data: ProductDetail) => {
            if (data.applicabilityList)
                data.applicabilityList.forEach(appItem => this.vehicles.push(appItem.name));
            this.EndSpinning();
        });
    }
}