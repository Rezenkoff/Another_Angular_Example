import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NavigationService } from '../../../services/navigation.service';
import { Order } from '../../../models';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { LanguageService } from '../../../services/language.service';
import { SearchParameters } from '../../../models/order-search-parameters.model';

@Component({
    selector: 'order-refund',
    templateUrl: './__mobile__/order.component.html',
    styleUrls: ['./__mobile__/styles/order.component__.scss']
})

export class OrderRefundComponent extends BaseLoader implements OnInit {

    public pageSize: number = 10;
    public totalItems: number = 0;
    private languageSubscription: any = null;
    orders: Order[];
    pager: any = {};
    pagedItems: Order[] = [];
    emptyOrder: boolean = false;
    clickCount: number = 0;
    lastClickedColumnName: string;
    searchParameters: SearchParameters = new SearchParameters(1, this.pageSize);
    private statusIssued: number = 7;

    constructor(private _orderService: OrderService,
        private _languageService: LanguageService,
        private navigation: NavigationService) {
        super();
        this.orders = [];
    }

    ngOnInit() {
        this.StartSpinning();
        this.languageSubscription = this._languageService.getLanguageChangeEmitter().subscribe(
            hasChanged => {
                this.getOrdersByUserName();
            });
        this.getOrdersByUserName();
    }

    getOrdersByUserName() {
        let language = this._languageService.getSelectedLanguage();
        if (language && language.id) {
            this.searchParameters.languageId = language.id;
        }
        this._orderService.getUserOrders(this.searchParameters)
            .subscribe(
                (response:any) => {
                    this.orders = response.data;
                    this.totalItems = response.total;
                    if (this.orders.length == 0)
                        this.emptyOrder = true;
                    this.EndSpinning();
                });
    }

    public pageChanged(event: any): void {
        this.searchParameters.currentPage = event.currentPage;
        this.getOrdersByUserName();
    }

    public onClickOrderRow(order: Order): void {
    }    

    public changePersonalData(order: Order) {
        this.navigation.NavigateToRefundSteps(order);
    }

    public redirectToRefundList() {
        this.navigation.NavigateToRefundList();
    }
}