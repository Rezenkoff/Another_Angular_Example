import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'autodoc-paging',
    templateUrl: './__mobile__/paging.component.html'
})
export class AutodocPagingComponent {
    @Input("totalItems") totalItems: number;
    @Input("currentPage") currentPage: number;
    @Input("maxSize") pageSize: number;
    @Output("pageChanged") pageChanged = new EventEmitter();
    private pageList: Array<number> = [];
    private onChange: Function;
    private onTouched: Function;
    private selectedPage: number;
    private pagesCount: number;

    ngOnChanges(changes) {
        this.doPaging();
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
}
