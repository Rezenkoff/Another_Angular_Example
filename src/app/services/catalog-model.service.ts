﻿import { Node } from '../catalog/models/node.model';
import { IBreadcrumb } from '../breadcrumbs/mc-breadcrumbs.shared';
import { Injectable, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { SearchParameters } from '../search/models/search-parameters.model';
import { Observable, of } from "rxjs";
import { map, tap, share, mergeMap, finalize } from 'rxjs/operators';
import { CatalogType } from '../catalog/models/catalog-type.enum';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");

@Injectable({providedIn: 'root'})
export class CatalogService {
    private cache: any = null;
    private _catalogMainModel: Node[];
    private nodesDictionary: { [id: number]: Node; } = {};
    private searchNodes: Node[] = [];
    private _catalog$: Observable<Node[]>;
    private _catalogType: CatalogType = CatalogType.Passenger;

    private _catalogFilteredModel: Node[];
    private _filteredNodesDictionary: { [id: number]: Node; } = {};
    private _fullCatalogObservable: Observable<Node[]> = null;
    private _fullCatalogLoaded: boolean = false;

    constructor(
        private _http: HttpClient,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
    ) {
        const options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public get CatalogTreeModel(): Node[] {
        return this._catalogMainModel;
    }

    public set CatalogTreeModel(val: Node[]) {
        this._catalogMainModel = val;
    }

    public getCatalogTreeModel(): Observable<Node[]> {

        if (this._catalogMainModel) {
            this._catalog$ = of(this._catalogMainModel);
        }

        if (!this._catalog$) {
            this._catalog$ = this.InitFullCatalog().pipe(
                map(treeModel => {
                    this._catalogMainModel = treeModel;

                    return this._catalogMainModel;
                }),
                share());
        }

        return this._catalog$.pipe(tap(() => this.convertTreeToList(this._catalogMainModel[0], CatalogType.Full)));
    }

    public getCatalogSimplifiedTreeModel(nodeId: number): Observable<Node[]> {

        this._catalog$ = this.InitPartialCatalog(nodeId).pipe(
            map(treeModel => {
                this._catalogMainModel = treeModel;

                return this._catalogMainModel;
            }),
            share());


        return this._catalog$.pipe(tap(() => this.convertTreeToList(this._catalogMainModel, CatalogType.Bot)));
    }

    public InitCatalogModel(): Observable<any> {
        return this.getFilledNodes(new SearchParameters());
    }

    public InitCatalogModelForType(catalogType: number): Observable<any> {
        this._catalogType = catalogType;
        let params = new SearchParameters();
        params.formFactor = catalogType;
        return this.getFilledNodes(params);
    }

    public InitFullCatalog(): Observable<any> {
        return this.getCachedTree(new SearchParameters());
    }

    public InitPartialCatalog(nodeId: number): Observable<any> {
        return this.getCachedPartialTree(nodeId);
    }

    public getNodeById(id: number, catalogType: CatalogType): Node {
        if ((Object.keys(this.nodesDictionary).length === 0 && this.nodesDictionary.constructor === Object)) {

            var c=this._catalogMainModel;

            const catalogModel = (catalogType == CatalogType.Bot) ?
                this._catalogMainModel :
                (this._catalogMainModel) ? (this._catalogMainModel)[0] : 
                this._catalogFilteredModel ? this._catalogFilteredModel[0] : null;
            this.convertTreeToList(catalogModel, catalogType);
        }

        return (catalogType == CatalogType.Filtered || catalogType == CatalogType.Passenger || catalogType == CatalogType.Truck) ?
            this._filteredNodesDictionary[id]:
            this.nodesDictionary[id];
    }

    public getNode(id: number, catalogType: CatalogType): Node {
        if ((Object.keys(this.nodesDictionary).length === 0 && this.nodesDictionary.constructor === Object)) {
            const catalogModel = (catalogType == CatalogType.Bot) ?
                this._catalogMainModel :
                (this._catalogMainModel) ? (this._catalogMainModel)[0] : this._catalogFilteredModel[0];
            this.convertTreeToList(catalogModel, catalogType);
        }

        return this.nodesDictionary[id];
    }

    public getNodeByIdForGoogleBot(id: number, catalogType: CatalogType): Observable<Node> {
        return this.InitCatalogModelForType(catalogType).pipe(map((result: any) => {
            return this.getNodeById(id, catalogType);
        }));
    }

    public getBredcrumbsForNode(nodeid: number, isbot: boolean): Observable<IBreadcrumb[]> {
        const catalogType = (isbot) ? CatalogType.Bot : CatalogType.Full;
        if (!this.CatalogTreeModel) {
            return this.getCatalogTreeModel().pipe(
                map(nodes => {

                    let node = this.getNode(nodeid, catalogType);
                    return (node && node.breadcrumbs) || [];
                })
            );
        }
        else {
            let node = this.getNode(nodeid, catalogType);

            return of<IBreadcrumb[]>((node && node.breadcrumbs) || []);
        }
    }       

    private convertTreeToList(root, catalogType: CatalogType) {
        var stack = [];
        let nodesDictionary = {};
        stack.push(root);

        while (stack.length !== 0) {
            var node = stack.pop();

            this.visitNode(node, nodesDictionary);

            for (var i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i]);
            }
        }
        if (catalogType == CatalogType.Filtered) {
            this._filteredNodesDictionary = nodesDictionary;
        } else {
            this.nodesDictionary = nodesDictionary;
        }
        return nodesDictionary;
    }

    private visitNode(node, hashMap) {
        if (!hashMap[node.nodeId]) {
            hashMap[node.nodeId.toString()] = node;
        }
    }

    public searchCatalogsNodes(value: string, tree: Node[], isFirstIteration: boolean): Observable<Node[]> {
        if (isFirstIteration)
            this.searchNodes = [];

        let lowerCaseValue = value.toLowerCase();

        tree.forEach(item => {
            let lowerCaseItemName = item.name.toLowerCase();
            if (lowerCaseItemName.includes(lowerCaseValue))
                this.searchNodes.push(item);
            if (item.hasChildren)
                this.searchCatalogsNodes(value, item.children, false);
        });

        return of<Node[]>(this.searchNodes);
    }

    public getNodesDictionary(): { [id: number]: Node; } {
        return this._filteredNodesDictionary;
    }

    public isCatalogReady(): boolean {
        return Boolean(this.CatalogTreeModel);
    }

    public getFilledNodes(searchParams: SearchParameters): Observable<Node[]> 
    {
        const cacheKey: string = 'nodes' + JSON.stringify(searchParams);
        const cached = this.cache.get(cacheKey);

        if (cached) {
            this._catalogFilteredModel = cached;
            this.convertTreeToList(this._catalogFilteredModel[0], CatalogType.Filtered);

            return new Observable((observer) => {
                setTimeout(() => {
                    observer.next(cached);
                    observer.complete();
                });
            });
        }

        let requestModel = {
            categoryUrl: searchParams.categoryUrl,
            searchParametersJson: JSON.stringify(searchParams)
        }
        return this._http.post<Node[]>(environment.apiUrl + 'catalog/get-filled', requestModel).pipe(
            map(response => {
                this._catalogFilteredModel = response;
                this.convertTreeToList(this._catalogFilteredModel[0], CatalogType.Filtered);

                return this._catalogFilteredModel;
            }),
            tap(data => {
                this.cache.set(cacheKey, data);
            }));
    }

    public getCachedPartialTree(nodeId: number): Observable<Node[]> 
    {
        const params = new HttpParams().set('nodeId', nodeId.toString());

        //change to transferhttp
        return this._http.get<Node[]>(environment.apiUrl + 'catalog/partial', { params });
    }

    public getBannerCatalog(bannerId: number): Observable<Node[]> 
    {
        const params = new HttpParams().set('bannerId', bannerId.toString());

        //change to transferhttp
        return this._http.post<Node[]>(environment.apiUrl + 'catalog/banner-category', { params })
            .pipe( map(list => list ));
    }

    public getCachedTree(searchParams: SearchParameters): Observable<Node[]> 
    {
        const headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get<Node[]>(environment.apiUrl + 'catalog/full', {headers:headers}).pipe(map(response => response));
    }
    public loadNodeById(nodeId:number): Observable<Node> 
    {
        const params = new HttpParams().set('nodeId', nodeId.toString());

        return this._http.get<Node>(environment.apiUrl + 'catalog/nodebyId',{params }).pipe(map(response => response));
    }
    public getCatalogType(): CatalogType {
        return this._catalogType;
    }

    public setupCatalogByType(catalogType: CatalogType, searchParameters: SearchParameters = new SearchParameters(), CatalogNodeId: number = 0, ): Observable<Node[]> {
        switch (catalogType) {
            case CatalogType.Bot:
                return this.getCatalogSimplifiedTreeModel(CatalogNodeId);
            case CatalogType.Full:
                return this.InitCatalogModelForType(catalogType);
            case CatalogType.Filtered:
            case CatalogType.Passenger:
            case CatalogType.Truck:
                return this.getFilledNodes(searchParameters);
        }
    }


    public findNodesByName(term: string): Observable<Node[]> {
        return this.getCatalogTreeModel().pipe(mergeMap(catalogTree => {
            return this.searchCatalogsNodes(term, catalogTree, true).pipe(mergeMap(nodes => {
                if (nodes && nodes.length) {
                    return of(nodes);
                }

                return this.getFullCatalog().pipe(mergeMap(tree => {
                    return this.searchCatalogsNodes(term, tree, true)
                }))
            }));
        }));
    }

    private getFullCatalog(): Observable<Node[]> {

        if (this._fullCatalogLoaded) {
            return this.InitCatalogModelForType(CatalogType.Full);
        }

        if (this._fullCatalogObservable) {
            return this._fullCatalogObservable;
        }

        this._fullCatalogObservable = this.InitCatalogModelForType(CatalogType.Full).pipe(
            finalize(() => this._fullCatalogLoaded = true),
            share());

        return this._fullCatalogObservable;
    }
} 