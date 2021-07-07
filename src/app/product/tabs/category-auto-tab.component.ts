import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { ApplicabilityItem } from '../models';
import { ProductService } from '../product.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { ProductDetail } from '../models/product-detail.model';
import { takeUntil } from 'rxjs/operators';
import { CarMark } from '../../cars-catalog/models';
import { CarCatalogService } from '../../cars-catalog/services/car-catalog.service';


@Component({
    selector: 'category-auto-tab',
    templateUrl: './__mobile__/category-auto-tab.component.html',
    styleUrls: ['./__mobile__/styles/category-auto-tab.component__.scss']
})
export class CategoryAutoTabComponent implements OnInit, OnDestroy {
    @Input() productDetails: ProductDetail;
    @Input() categoryName: string;
    @Input() categoryUrl: string;
    @Input() categoryId: number;
    @Input() productId: number;
    public categoryLink: string;
    public applicabilityListCars: Array<ApplicabilityItem> = [];
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public carsList$: Observable<CarMark[]> = new Observable<CarMark[]>();

    public markKeyList: Array<string> = [];
    public serieKeyList: Array<string> = [];
    public linksName: Array<string> = [];

    constructor(
        private _productService: ProductService,
        private _carCatalogService: CarCatalogService
    ) { }

    ngOnInit() {
        this._productService.getProductDetails(this.productId).subscribe(data => {
            if (!data.applicabilityList || !this.categoryName) {
                return;
            }
            this.applicabilityListCars = data.applicabilityList;

            this._carCatalogService.getAllSeries().pipe(takeUntil(this.destroy$)).subscribe(cars => {
                this.applicabilityListCars.forEach(applyCars => {
                    cars.forEach(car => {
                        if (applyCars.name.toUpperCase() == car.markName.toUpperCase()) {
                            car.seriesList.forEach(serieCar => {
                                if (applyCars.children.filter(x => x.name.split(' ')[0].toUpperCase() == serieCar.serieName.toUpperCase()).length > 0) {
                                    this.linksName.push(`${this.categoryName} на ${car.markName} ${serieCar.serieName}`);
                                    this.markKeyList.push(`${car.markKey}--2000`);
                                    this.serieKeyList.push(`${serieCar.serieKey}--2001`);
                                }
                            });
                        }
                    });
                });
            });
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getLink(index: number): string[] {
        return ['/category', `${this.categoryUrl}`, `${this.markKeyList[index]}`, `${this.serieKeyList[index]}`];
    }
}