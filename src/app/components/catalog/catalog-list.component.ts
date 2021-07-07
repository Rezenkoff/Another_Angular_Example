import { Component, OnInit, Inject } from '@angular/core';
import { Node } from '../../catalog/models/node.model';
import { CatalogService } from '../../services/catalog-model.service';
import { NavigationService } from '../../services/navigation.service';
import { CatalogPopupComponent } from '../../components/catalog/catalog-popup.component';
import { MatDialogRef } from '@angular/material/dialog';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { CatalogType } from '../../catalog/models/catalog-type.enum';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

const defaultCatalogType: CatalogType = CatalogType.Passenger;

@Component({
    selector: 'catalog-list',
    templateUrl: './__mobile__/catalog-list.component.html'
})
export class CatalogListComponent implements OnInit {
    public catalogTree: Node[] = null;
    public nodeForSearch: Node;
    public showDropDown: boolean = false;
    public findedNodes: Node[] = [];
    public catalogType: CatalogType = defaultCatalogType;
    public catalogType$: BehaviorSubject<CatalogType> = new BehaviorSubject<CatalogType>(defaultCatalogType);

    constructor(
        private dialogRef: MatDialogRef<CatalogPopupComponent>,
        private _catalogService: CatalogService,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _navigationService: NavigationService,
        private _activatedRoute: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        let queryParams = this._activatedRoute.snapshot.queryParams;
        if (queryParams && queryParams['formFactor'] !== undefined) {
            this.catalogType = queryParams['formFactor'];
            this.catalogType$.next(+this.catalogType);// convert to number
        }
        this.loadCatalog();      
    }

    public switchCatalog(catalogType: CatalogType): void {
        this.catalogType = catalogType;
        this.catalogType$.next(this.catalogType);
        this.loadCatalog();
    }

    private loadCatalog(): void {
        this.catalogTree = null;
        this._catalogService.InitCatalogModelForType(this.catalogType).subscribe(nodes => {
            this._catalogService.CatalogTreeModel = nodes;
            this.catalogTree = nodes;
        });  
    }

    public closeModal(): void {
        this.dialogRef.close();
    }

    public catalogFilter(data: string): void {
        
        this._catalogService.searchCatalogsNodes(data, this._catalogService.CatalogTreeModel, true).subscribe(x => { this.showDropDown = true; this.findedNodes = x; });
    }

    public redirectToCategory(node: Node): void {
        this._navigationService.NavigateToCategory(node);
        this.dialogRef.close();
    }

    public hideDropdown(): void {
        this.showDropDown = false;
    }

    public getDisplay(): void {
        return this.showDropDown ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }
}
