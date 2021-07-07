import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'seo-paging',
    templateUrl: './__mobile__/seo-paging.component.html'
})
export class SeoPagingComponent {
    @Input("totalItems") totalItems: number;
    @Input("currentPage") currentPage: number;
    @Input("maxSize") pageSize: number;
    @Input("queryParameters") queryParameters: Object = {};
    @Output("pageChanged") pageChanged = new EventEmitter();
    private pageList: Array<number> = [];
    private onChange: Function;
    private onTouched: Function;
    private selectedPage: number;
    private pagesCount: number;
    private pageFromLoadMore: number = 0;

    ngOnChanges(changes) {
        this.doPaging();
        this.setActivePage();
    }

    private doPaging() {
        this.pageList = [];
        this.selectedPage = this.currentPage;
        this.pagesCount = Math.ceil(this.totalItems / this.pageSize);

        let from = this.currentPage - 2;
        if (from < 1) from = 1;

        let to = from + 4;
        let dif = this.pagesCount - to;
        if (dif < 0) {
            from += dif;
            if (from < 1) from = 1;
            to = this.pagesCount;
        }

        for (let i = from; i <= to; i++) {
            this.pageList.push(i);
        }
    }

    private setCurrentPage(pageNo: number) {
        if (this.isActive(pageNo))
            return;
        this.selectedPage = pageNo;
        this.pageChangeListener();
    }

    private previousItemValid(): boolean {
        return this.currentPage > 1;
    }

    private nextItemValid(): boolean {
        return this.currentPage !== this.pagesCount;
    }

    private toFirstPage(): void {
        this.setCurrentPage(1);
    }

    private toLastPage(): void {
        this.setCurrentPage(this.pagesCount);
    }

    private registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    private registerOnTouched(fn: (_: any) => {}): void {
        this.onTouched = fn;
    }

    private pageChangeListener() {
        this.pageChanged.emit({
            currentPage: this.selectedPage
        })
    }

    private getParamsForFirstPage() {
        let params = { ...this.queryParameters['queryParams'] };
        delete params['page'];
        return params;
    }

    private getParamsForPage(pageNum: number) {
        if (pageNum === 1) {
            return this.getParamsForFirstPage();
        }

        return { ...this.queryParameters['queryParams'], page: pageNum };
    }

    private setActivePage() {
        let params = { ...this.queryParameters['queryParams'] };
        let queryPage = params['page'] || 1;
        this.pageFromLoadMore = queryPage != this.currentPage ? queryPage : this.currentPage;
    }

    private isActive(pageNo: number) {
        return this.pageFromLoadMore <= pageNo && pageNo <= this.selectedPage;
    }
}
