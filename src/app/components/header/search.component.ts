import { Component, Inject } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Node } from '../../catalog/models/node.model';
import { CatalogService } from '../../services/catalog-model.service';
import { first } from 'rxjs/operators';
import { GtagService } from '../../services/gtag.service';
import { PolisService } from '../../polis/polis.service';

@Component({
    selector: 'search',
    templateUrl: './__mobile__/search.component.html'
})

export class SearchComponent {
    searchString: string = '';
    public findedNodes: Node[] = [];
    public showDropDown: boolean = true;
    public isSearching: boolean = false;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _catalogService: CatalogService,
        private _navigationService: NavigationService,
        private _gtagService: GtagService,
        private _polisService: PolisService, ) { }

    search() {

        this.isSearching = true;
        let containsLetters = new RegExp("(([A-zА-яё]{2})[0-9]{4}([A-zА-яё]{2}))");
        let isValidVin = new RegExp(this._constants.PATTERNS['VIN_REGEX']);

        let str = this.searchString.trim().toUpperCase();
        this.showDropDown = false;
        this._gtagService.search.sendEventSearch(this.searchString);
        this._gtagService.viewSearchResult.sendEventSearch(this.searchString);
        if (isValidVin.test(str)) {

            this.isSearching = false;
            this._navigationService.NavigateToFindByAuto(str);
            return;
        }

        if (containsLetters.test(str)) {
            this._polisService.GetCarInfoByNumber(str)
                .subscribe((carInfoResponse:any) => {
                    if (carInfoResponse.success && carInfoResponse.data.car.vin) {
                        this.searchString = carInfoResponse.data.car.vin;
                        this.isSearching = false;
                        this._navigationService.NavigateToFindByAuto(carInfoResponse.data.car.vin);
                        return;
                    }
                    else {
                        this.isSearching = false;
                        this._navigationService.NavigateToSearchResult(this.searchString);
                        return;
                    }
                });
        }
        this.isSearching = false;
        this._navigationService.NavigateToSearchResult(this.searchString);
    }

    public catalogFilter(data: string, event: any): void {
        if (!data || !data.trim() || data.length < 3 || event.code === "Enter") {
            this.showDropDown = false;
            return;
        }


        this._catalogService.getCatalogTreeModel().pipe(first()).subscribe((catalogTree) => {
            this._catalogService.searchCatalogsNodes(data, catalogTree, true).subscribe(x => {
                this.findedNodes = x;
            });
            this.showDropDown = true;
        });
    }

    public redirectToCategory(node: Node): void {
        this._gtagService.search.sendEventSearch(node.name);
        this._gtagService.viewSearchResult.sendEventSearch(node.name);
        this._navigationService.NavigateToCategory(node);
        this.showDropDown = false;
    }

    public hideDropdown(): void {
        this.showDropDown = false;
    }

    public dropdownShown(): boolean {
        return (this.findedNodes.length > 0 && this.showDropDown);
    }
}
