import { Component, Inject, OnDestroy } from '@angular/core';
import { LaximoService } from '../services/laximo.service';
import { BaseLoader } from '../shared/abstraction/loaderbase.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TreeNode } from './child/models/tree-node.model';
import { DetailGroupModel } from './child/models/detail-group.model';
import { finalize, takeUntil } from 'rxjs/operators';
import { BitrixService } from '../services/bitrix.service';
import { AlertService } from '../services/alert.service';
import { LanguageService } from '../services/language.service';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../translate/custom/alert-translation';
import { Subject } from 'rxjs';

@Component({
    selector: 'detail-groups',
    templateUrl: './__mobile__/detail-groups.component.html'
})

export class DetailGroupsComponent extends BaseLoader implements OnDestroy {

    ssd: string;
    code: string;
    vehicleId: number;
    brand: string;
    nodeId: string;
    car: any;
    mainNode: TreeNode;
    currentNode: TreeNode;
    detailInfo: DetailGroupModel = null;
    units: Array<DetailGroupModel> = new Array<DetailGroupModel>();
    breadcrumbs: Array<TreeNode> = new Array<TreeNode>();
    isMobileScreen: boolean = false;
    vin: string;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    

    constructor(
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _bitrixService: BitrixService,
        private _alertService: AlertService,
        private _languageService: LanguageService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _laximoService: LaximoService
    ) {
        super();

        _router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.initialize();
            }
        });
    }

    initialize() {
        this.StartSpinning();
        this.isMobileScreen = (window.innerWidth > 767) ? false : true;
        this.nodeId = this._route.snapshot.paramMap.get('nodeId');
        this.brand = this._route.snapshot.paramMap.get('brand');
        this.ssd = this._route.snapshot.paramMap.get('ssd');
        this.code = this._route.snapshot.paramMap.get('code');
        this.vehicleId = Number(this._route.snapshot.paramMap.get('vehicleId'));
        this.car = { brand: this.brand, name: '', date: '', engine: '' };
        this.vin = this._route.snapshot.paramMap.get('vinCode');

        this._laximoService.GetNode(this.code, this.ssd, this.vehicleId, this.nodeId).pipe(
            finalize(() => {
                this.EndSpinning();
            }))
            .subscribe(data => {
                this.resetInfo();
                this.currentNode = data;
                this.setBreadCrumbsAndMainNode(this.currentNode);
                if (this.currentNode.link) {
                    this.setUnits(this.currentNode);
                }
            });

        this._laximoService.GetVehicleInfo(this.code, this.ssd, this.vehicleId)
            .subscribe(data => {
                if (data['row'][0]) {
                    this.car = data['row'][0];
                    this.car['brand'] = this.brand;
                }
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    navigationDisplayed(): boolean {
        if (this.currentNode && !this.detailInfo && !this.inProcess) {
            return true;
        }
        return false;
    }

    onSearchChange(filterString: string) {
        this.resetInfo();
        if (!filterString) {
            this.currentNode = this.mainNode;
            return;
        }

        let filtered = new Array<TreeNode>();
        this.filterDetails(this.mainNode, filtered, filterString);
        this.currentNode = new TreeNode(0, 'Отфильтрованные детали', false, filtered);
    }

    filterDetails(node: TreeNode, target: Array<TreeNode>, filterString: string) {
        let filtered = new Array<TreeNode>();
        if (node.name.toLowerCase().includes(filterString.toLowerCase())) {
            target.push(node);
        }
        if (node.children && node.children.length > 0) {
            node.children.map(item => this.filterDetails(item, target, filterString));
        }
    }

    detailInfoDisplayed(): boolean {
        if (this.detailInfo) {
            return true;
        }
        return false;
    }

    onDetailSelect(node: TreeNode) {

        this.resetInfo();
        this.setBreadCrumbsAndMainNode(node);

        if (!node.children || node.children.length === 0) {
            this.setUnits(node);
            return;
        }

        this._router.navigate(['detail-groups', { ssd: this.ssd, code: this.code, vehicleId: this.vehicleId, brand: this.brand, nodeId: node.id }]);
    }

    resetInfo() {
        this.detailInfo = null;
        this.breadcrumbs = new Array<TreeNode>();
        this.units = new Array<DetailGroupModel>();
    }

    setBreadCrumbsAndMainNode(node: TreeNode) {
        if (node.parent) {
            this.setBreadCrumbsAndMainNode(node.parent);
        }
        else {
            this.mainNode = node;
        }
        this.breadcrumbs.push(node);
    }

    setUnits(node) {
        let language = this._languageService.getSelectedLanguage().name;
        this.StartSpinning();
        this._laximoService.GetGroupsDetail(this.code, this.ssd, this.vehicleId, node.id).pipe(
            finalize(() => this.EndSpinning()),
            takeUntil(this.ngUnsubscribe)
        ).subscribe(resp => {
            if (resp.length === 0) {
                this._alertService.info(this._translations.MESSAGE[`group_without_products_${language}`]);
            }
            this.units = resp;
        })
    }

    previewDisplayed() {
        return (this.units.length > 0);
    }

    backToNavigation() {
        let indexOfPrevNode = this.breadcrumbs.length - 1;
        this.onDetailSelect(this.breadcrumbs[indexOfPrevNode]);
    }

    navigateToFindByAuto() {
        this._router.navigateByUrl(`find-by-auto`);
    }

    getImgUrl(detail: DetailGroupModel) {
        if (!detail || !detail.imageurl) {
            return;
        }
        return detail.imageurl.replace('%size%', '250');
    }

    showDetail(detail: DetailGroupModel) {
        this.detailInfo = detail;
        this.units = new Array<DetailGroupModel>();
    }
}