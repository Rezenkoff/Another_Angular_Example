import { Component, Input } from '@angular/core';
import { BrandNode } from '../models/brand-node.model';
import { Router } from '@angular/router';

const urlDelimiter: string = "--";

@Component({
    selector: 'category-level',
    templateUrl: './__mobile__/category-level.component.html'
})
export class CategoryLevelComponent {

    @Input() public currentLevel: BrandNode;
    @Input() public routeArray: string[] = [];
    @Input() public isParentNode: boolean = false;

    public childrenHidden: boolean = true;

    constructor(private _router: Router) { }

    public hasChildren(): boolean {
        return Boolean(this.currentLevel.children && this.currentLevel.children.length > 0);
    }

    public trackByFn(index, item) {
        return index;
    }

    public getRoute(): string[] {
        let route = this.routeArray[0] + urlDelimiter + this.currentLevel.urlSuffix;
        return ['/category', this.currentLevel.pageURL, route];
    }

    public toggleChildren(): void {
        this.childrenHidden = !this.childrenHidden;
    }

    public getClass(): string {
        return (this.childrenHidden) ?
            "glyphicon glyphicon-plus-sign" :
            "glyphicon glyphicon-minus-sign";
    }

    public getChildrenList() {
        return this.currentLevel.children;
    }

    public nodeClick() {
        let route = this.getRoute();
        this._router.navigate(route);
    }
}