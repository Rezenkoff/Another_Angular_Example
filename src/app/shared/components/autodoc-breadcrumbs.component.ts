import { Subscription } from 'rxjs';
import { IBreadcrumb } from '../../breadcrumbs/mc-breadcrumbs.shared';
import { McBreadcrumbsService } from '../../breadcrumbs/service/mc-breadcrumbs.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'autodoc-breadcrumbs',
    templateUrl: './__mobile__/autodoc-breadcrumbs.component.html'
})
export class AutodocBreadcrumbsComponent implements OnInit, OnDestroy {
    constructor(
        public service: McBreadcrumbsService
        ) { }

    crumbs: IBreadcrumb[];

    subscriptions = new Array<Subscription>();

    public ngOnInit(): void {
        const s = this.service.crumbs$.subscribe((x) => {
            this.crumbs = x;
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((x) => x.unsubscribe());
    }

    public getLink(crumb: IBreadcrumb): string {
        return crumb.path;
    }

    public getParams(): Object {
        return this.service.getQueryParamsForBreadcrumb();
    }
}