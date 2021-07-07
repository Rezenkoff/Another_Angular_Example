import { LAXIMO_TRANSLATIONS, ILaximoTranslations } from '../translate/custom/laximo-translations';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { TreeNode } from '../detail-groups/child/models/tree-node.model';
import { DetailGroupModel } from '../detail-groups/child/models/detail-group.model';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");

@Injectable()
export class LaximoService {
    private cache: any = null;
    private nodesDict: Object = new Object();

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(LAXIMO_TRANSLATIONS) private _translations: ILaximoTranslations,
        private _http: HttpClient) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public GetCarMarks() {
        var cacheKey: string = 'laximo_vehicle_marks';
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }

        return this._http.get(environment.apiUrl + 'laximo/carmarks').pipe(
            map((resp) => resp),
            tap(data => this.cache.set(cacheKey, data)));
    }

    public GetAdditionalParameters(code: string, ssd?: string) {
        if (!code) {
            return;
        }

        var cacheKey: string = `additional_parameters_${code}_${ssd}`;
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }

        const params = new HttpParams()
            .set('code', code)
            .set('ssd', ssd);

        return this._http.get(environment.apiUrl + 'laximo/parameters', { params })
            .pipe(
                map((resp) => resp),
                tap(data => this.cache.set(cacheKey, data)));
    }

    public GetCarsList(catalog: string, ssd: string) {
        if (!catalog || !ssd) {
            return;
        }

        var cacheKey: string = `catalog_cars_${catalog}_${ssd}`;
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }

        const params = new HttpParams()
            .set('catalog', catalog)
            .set('ssd', ssd);

        return this._http.get(environment.apiUrl + 'laximo/carlist', {params})
            .pipe(
                map((resp) => resp),
                tap(data => this.cache.set(cacheKey, data)));
    }

    public SearchByVin(vin: string) {
        if (!vin) {
            return;
        }

        var cacheKey: string = `vin_car_${vin}`;
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }

        
        const params = new HttpParams()
            .set('vin', vin);

        return this._http.get(environment.apiUrl + 'laximo/vinsearch',  {params})
            .pipe(
                map((resp) => resp),
                tap(data => this.cache.set(cacheKey, data)));
    }

    public GetGroups(code: string, ssd: string, vehicleId: number) {
        if (!code || !ssd) {
            return;
        }

        var cacheKey: string = `groups_${code}_${ssd}_${vehicleId}`;
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }
        
        const params = new HttpParams()
            .set('code', code)
            .set('vehicleId', vehicleId.toString())
            .set('ssd', ssd);       

        return this._http.get(environment.apiUrl + 'laximo/groups', {params})
            .pipe(
                map((resp) => resp),
                tap(data => this.cache.set(cacheKey, data)));
    }

    public GetGroupsDetail(code: string, ssd: string, vehicleId: number, groupId: number): Observable<Array<DetailGroupModel>> {
        if (!code || !ssd || !groupId) {
            return;
        }

        var cacheKey: string = `detail_groups_${code}_${ssd}_${vehicleId}_${groupId}`;
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);

        }
       
        const params = new HttpParams()
            .set('code', code)
            .set('vehicleId', vehicleId.toString())
            .set('groupId', groupId.toString())
            .set('ssd', ssd);

        return this._http.get(environment.apiUrl + 'laximo/groupsdetail', {params})
            .pipe(
                map((resp) => {
                    let detailGroups: Array<DetailGroupModel> = new Array<DetailGroupModel>();
                    this.processResponse(resp, detailGroups);
                    return detailGroups;
                }),
                tap(data => {
                    this.cache.set(cacheKey, data);
                }));
    }

    public GetVehicleInfo(catalogCode: string, ssd: string, vehicleId: number) {
        if (!catalogCode || !ssd) {
            return;
        }

        var cacheKey: string = `car_${ssd}`;
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }

        const params = new HttpParams()
            .set('catalogCode', catalogCode)
            .set('vehicleId', vehicleId.toString())            
            .set('ssd', ssd);
        
        return this._http.get(environment.apiUrl + 'laximo/getvehicleinfo', {params})
            .pipe(
                map((resp) => resp),
                tap(data => this.cache.set(cacheKey, data)));
    }

    public GetImageMapping(code: string, ssd: string, unitId: number) {
        if (!code || !ssd || !unitId) {
            return;
        }

        var cacheKey: string = `img_mapping_${code}_${ssd}_${unitId}`;
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }

        const params = new HttpParams()
            .set('code', code)
            .set('unitId', unitId.toString())
            .set('ssd', ssd);

        return this._http.get(environment.apiUrl + 'laximo/imageMapping', {params})
            .pipe(
                map((resp) => resp),
                tap(data => {
                    if (data["Message"] === "An error has occurred.") {
                        return;
                    }
                    this.cache.set(cacheKey, data);
                }));
    }

    public GetUnitItems(code: string, ssd: string, unitId: number) {
        if (!code || !ssd || !unitId)
            return;

        let cacheKey = `unit_items_${code}_${ssd}_${unitId}`;
        var cached = this.cache.get(cacheKey);

        if (cached)
            return of(cached);

        const params = new HttpParams()
            .set('code', code)
            .set('unitId', unitId.toString())
            .set('ssd', ssd);

        return this._http.get(environment.apiUrl + 'laximo/unitItems', {params})
            .pipe(map((resp) => resp),
                tap(data => {
                    if (data["Message"] === "An error has occurred.") {
                        return;
                    }
                    this.cache.set(cacheKey, data);
                }));
    }

    public SaveCarBySsd(ssd: string, data: any) {
        if (!ssd) {
            return;
        }

        var cacheKey: string = `car_${ssd}`;
        this.cache.set(cacheKey, data);
    }

    public GetTranslation(word: string, language: string): string {
        return this._translations.PARAMETERS[`${word}_${language}`] || word;
    }

    public GetNode(code: string, ssd: string, vehicleId: number, key: string): Observable<TreeNode> {
        let result: TreeNode;
        if (!key) {
            return this.GetRootNode(code, ssd, vehicleId);
        }
        if (!this.nodesDict['root']) {
            return this.GetRootNode(code, ssd, vehicleId).pipe(
                map(() => {
                    result = this.nodesDict[key] || this.nodesDict['root']
                    return result;
                }));
        }

        let node = this.nodesDict[key];

        if (!node) {
            return this.GetRootNode(code, ssd, vehicleId) as Observable<TreeNode>;
        }

        return of<TreeNode>(node);
    }

    private GetRootNode(code: string, ssd: string, vehicleId: number): Observable<TreeNode> {
        let result: TreeNode;
        return this.GetGroups(code, ssd, vehicleId).pipe(
            map(
                data => {
                    let resp = data['row'][0];
                    this.nodesDict['root'] = new TreeNode(0, 'Все группы', false, new Array<TreeNode>());
                    this.convertToTreeNodes(resp, this.nodesDict['root']);
                    result = this.nodesDict['root'] || null;
                    return result;
                }));
    }

    convertToTreeNodes(source, target: TreeNode) {
        for (let detail of source['row']) {
            let name = this.capitalizeFirstLetter(detail['name']);
            let node: TreeNode = { id: detail['quickgroupid'], name: name, parent: target, link: detail['link'] };

            if (detail['row'] && detail['row'].length > 0) {
                node.children = new Array<TreeNode>();
                this.convertToTreeNodes(detail, node);
            }

            target.children.push(node);
            this.nodesDict[node.id] = node;
        }
    }

    capitalizeFirstLetter(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    processResponse(response: any, targetArray: Array<DetailGroupModel>) {
        if (!response['Category'] || !response['Category'][0] || !response['Category'][0]['Unit']) {
            return;
        }

        for (let n = 0; n < response['Category'].length; n++) {
            if (response['Category'][n]['Unit']) {
                let currentUnits: Array<Object> = response['Category'][n]['Unit'];
                currentUnits.map(unit => {
                    let detailInfo = unit as DetailGroupModel;
                    detailInfo.category = response['Category'][n].name.toUpperCase();
                    targetArray.push(detailInfo);
                })
            }
        }
    }
}