import { Injectable, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable()
export class LinkService {

    constructor(
        private rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document,
        private _activatedRoute: ActivatedRoute
    ) { }
  
    private addTag(tag: LinkDefinition, forceCreation?: boolean) {
        try {
            const renderer = this.getRenderer();

            const link = renderer.createElement('link');
            const head = this.document.head;
            const selector = this._parseSelector(tag);

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            Object.keys(tag).forEach((prop: string) => {
                return renderer.setAttribute(link, prop, tag[prop]);
            });
            
            renderer.appendChild(head, link);

        } catch (e) {
            console.error('Error within linkService : ', e);
        }
    }

    public removeLink(relName: string) {
        try {
            const renderer = this.getRenderer();

            let children = this.document.head.children;
            for (var idx = 0; idx < children.length; idx++) {
                if (children[idx].localName === 'link' && children[idx].rel === relName)
                    renderer.removeChild(this.document.head, children[idx]);
            }

        } catch (e) {
            console.error('Error within linkService : ', e);
        }
    }

    public setLink(relName: string, href: string) {
        try {
            const renderer = this.getRenderer();

            let children = this.document.head.children;
            for (var idx = 0; idx < children.length; idx++) {
                if (children[idx].localName === 'link' && children[idx].rel === relName) {
                    if (children[idx].href == href) {
                        return;
                    } 
                    renderer.setAttribute(children[idx], 'href', href);
                    return;
                }                
            }
            this.addTag({ rel: relName, href: href });

        } catch (e) {
            console.error('Error within linkService : ', e);
        }
    }

    private _parseSelector(tag: LinkDefinition): string {
        // Possibly re-work this
        const attr: string = tag.rel ? 'rel' : 'hreflang';
        return `${attr}="${tag[attr]}"`;
    }

    private getRenderer(): any {
        return this.rendererFactory.createRenderer(this.document, {
            id: '-1',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
        });
    }

    public buildSEOlinks(totalCount: number, additional: string = "", ignoredTags: string[] = []): void {
        this.processLinks(totalCount, additional, ignoredTags);
    }

    public addCanonicalLinkForProduct(): void {
        const url = environment.hostUrl;
        let routePath = '';
        const path = this._activatedRoute.snapshot['_routerState']['url'];        
        if (path) {
            routePath = this.getRouteSectionFromUrl(path);
        }   
        const canonicalLink = `${url}${routePath}`;

        this.setLink('canonical', canonicalLink);
    }

    private processLinks(total: number, additional: string = "", ignoredTags: string[] = []) {
        let params = this._activatedRoute.snapshot.queryParams;
        let url = environment.hostUrl;
        let routePath = '';
        let delimeterSymbol = (additional) ? '&' : '?';

        let path = this._activatedRoute.snapshot['_routerState']['url'];
        if (path) {            
            routePath = this.getRouteSectionFromUrl(path);
        }        
        
        let pageNum = Number(params["page"]) || 1;        
        let pageSize = Number(params['count'] || 20);

        let baseUrl = `${url}${routePath}${additional}`;
        let prevLink = (pageNum === 2) ? baseUrl : `${baseUrl}${delimeterSymbol}page=${pageNum - 1}`;
        let nextLink = `${baseUrl}${delimeterSymbol}page=${pageNum + 1}`;
        let canonicalLink = (pageNum === 1) ? baseUrl : `${baseUrl}${delimeterSymbol}page=${pageNum}`;

        if (pageNum === 1 && !ignoredTags.includes('next')) { //first page
            if (total > pageSize) { //not a single page
                this.setLink('next', nextLink);
            }            
            this.removeLink('prev');
        }
        else if (pageNum * pageSize >= total && !ignoredTags.includes('prev')) { //last page
            this.setLink('prev', prevLink);
            this.removeLink('next');
        }
        else {//other pages
            if (!ignoredTags.includes('prev')) {
                this.setLink('prev', prevLink);
            }
            if (!ignoredTags.includes('next')) {
                this.setLink('next', nextLink);
            }            
        }

        if (!ignoredTags.includes('canonical')) {
            this.setLink('canonical', canonicalLink);
        }

        ignoredTags.forEach(tag => this.removeLink(tag));
    }

    public clearSEOlinks(): void {
        this.removeLink('prev');
        this.removeLink('next');
        this.removeLink('canonical');
    }

    private getRouteSectionFromUrl(url: string) {
        let firstCharacter: number = (url.indexOf('/') > 0) ? url.indexOf('/') : 0;
        let lastCharacter: number = (url.indexOf('?') > 0) ? url.indexOf('?') : url.length;
        return url.substring(firstCharacter, lastCharacter);
    }
}

export declare type LinkDefinition = {
    charset?: string;
    crossorigin?: string;
    href?: string;
    hreflang?: string;
    media?: string;
    rel?: string;
    rev?: string;
    sizes?: string;
    target?: string;
    type?: string;
} & {
        [prop: string]: string;
    };