import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NavigationService } from '../../../services/navigation.service';
import { Order } from '../../../models';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { GlobalTransportService, ActionEvent } from '../../../services/global-flag.service';
import { LanguageService } from '../../../services/language.service';
import { Parcel } from '../../../models/global-flag.model';
import { SearchParameters } from '../../../models/order-search-parameters.model';

@Component({
    selector: 'order',
    templateUrl: './__mobile__/order.component.html',
    styleUrls: ['./__mobile__/styles/order.component__.scss']
})
export class OrderComponent extends BaseLoader implements OnInit {
    public pageSize: number = 10;
    public totalItems: number = 0;
    private languageSubscription: any = null;
    public isCollapsed: boolean = false;
    orders: Order[];
    pager: any = {};
    pagedItems: Order[] = [];
    emptyOrder: boolean = false;
    clickCount: number = 0;
    lastClickedColumnName: string;
    searchParameters: SearchParameters = new SearchParameters(1, this.pageSize);

    constructor(private _orderService: OrderService,private navigation: NavigationService, private _languageService: LanguageService,private _navigationService: NavigationService, private _transportService: GlobalTransportService,) {
        super();
        this.orders = [];
    }

    ngOnInit() {
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
                this.orders = response.data.map(i => new Order().deserialize(i));
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

    returnToCabinetInfo() {
        this._navigationService.NavigateToMobileInfo();
    }


    public toggleCollapse(order: Order): void {
     
        let selectedOrder = (this.orders.find(ord => ord == order));
        let open = !selectedOrder.isOpen;
        selectedOrder.isOpen = open;

        if (open) {
            let orderParcel = new Parcel();
            orderParcel.typeFlag = ActionEvent.getOrderInvoices;
            orderParcel.value = order;
            
            this._transportService.emitParcel(orderParcel);
        }
    } 

    onColumnClick(propertyName: string) {
        if (propertyName !== this.lastClickedColumnName) {
            this.lastClickedColumnName = propertyName;
            this.clickCount = 0;
        }

        if (this.clickCount === 3) {
            this.clickCount = 0;
        }

        this.clickCount += 1;

        if (this.clickCount === 3) {
            this.lastClickedColumnName = "OrderDate";
        }

        this.searchParameters.orderArrangement = (this.clickCount === 1) ? "ASC" : "DESC";
        this.searchParameters.orderBy = this.lastClickedColumnName;
        this.getOrdersByUserName();
    }

    afterPayment(event: any) {
        this.getOrdersByUserName();
    }

    public changePersonalData(order: Order) {
        this.navigation.NavigateToRefundSteps(order);
    }
}