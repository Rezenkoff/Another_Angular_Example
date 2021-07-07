import { Component, Input } from '@angular/core';
import { Node } from '../../catalog/models/node.model';
import { Params } from '@angular/router';

@Component({
    selector: 'category-level',
    templateUrl: './__mobile__/category-level.component.html',
    styleUrls: ['./__mobile__/styles/category-level.component__.scss']
})

export class CategoryLevelComponent {

    @Input()
    public currentLevel: Node;

    @Input()
    public routeArray: string[] = [];

    @Input()
    public queryParams: Params = null;

    @Input() isOpenNode: boolean;

    @Input() public childrenHidden: boolean;

    public hasChildren(): boolean {
        return Boolean(this.currentLevel.children && this.currentLevel.children.length > 0);
    }

    public trackByFn(index, item) {
        return index;
    }

    public getRoute(): string[] {
        return ['/category', this.currentLevel.pageURL, ...this.routeArray];
    }

    public toggleChildren(): void {
        this.childrenHidden = !this.childrenHidden;
    }

    public getClass(): string {
        return (!this.isOpenNode) ?
            "text-sub-catalog" :
            "text-sub-link-catalog";
    }

    public getClassMarker(): string {
        return (this.childrenHidden ? 'line-plus-catalog' : 'line-minus-catalog');
    }

    public getChildrenList() {
        return this.currentLevel.children;
    }
}