import { Injectable } from '@angular/core';
import { UserStorageService } from './user-storage.service';
import { Order } from '../models/client-order.model';
import { Router } from '@angular/router';

@Injectable()
export class NavigationService {
    constructor(      
        private userStorage: UserStorageService, 
        private router: Router
        ) { }

    public NavigateToMobileInfo() {
        this.router.navigate(['cabinet/info']);
    }

    public NavigateToMobileOrder() {
        this.router.navigate(['cabinet/order']);
    }

    public navigateToMobileVehicle() {    
        this.router.navigate(['cabinet/vehicle']);
    }

    public navigateToMobileProfile() {            
        this.router.navigate(['cabinet/profile']);
    }

    public navigateToMobileFordev() {            
        this.router.navigate(['cabinet/fordev']);
    }

    public navigateToMobileFavorite() {    
        this.router.navigate(['cabinet/favorite']);
    }

    public navigateToMobileRefund() {    
        this.router.navigate(['cabinet/refund']);
    }

    public NavigateToLogin() {
        this.router.navigate(['authentication']);
    }

    public NavigateToCaptcha(mainBlockerKey: string, blockerKey: string, ) {
        this.router.navigate(['captcha', mainBlockerKey, blockerKey]);
    }

    public NavigateToLoginAfterRegistrationSuccess() {
        this.router.navigate(['authentication'], { queryParams: { regSuccess: true } });
    }

    public NavigateToCabinet() {
        this.router.navigate(['cabinet']);
    }

    public NavigateToRegistration() {
        this.router.navigate(['authentication/registration']);
    }

    public NavigateToForgotPassword() {
        this.router.navigate(['authentication/forgot-password']);
    }

    public NavigateToHome() {
        this.router.navigate(['/']);
    }

    public NavigateToSuccessOrder(orderId: string, orderSecretLinkCode: string = '') {
        this.router.navigate(['order-main/success', orderId, orderSecretLinkCode]);
    }

    public NavigateToSuccessOrderCheckout(orderId: string, orderSecretLinkCode: string = '', email: string = '', isInvoiceCreated: boolean = true) {
        this.router.navigate(['order-checkout/order-checkout-success', orderId, orderSecretLinkCode, email], { queryParams: { invoice: isInvoiceCreated } });
    }

    public NavigateToSuspendedOrderCheckout(orderId: string, orderSecretLinkCode: string = '') {
        this.router.navigate(['order-checkout/order-checkout-suspended', orderId, orderSecretLinkCode]);
    }
    public NavigateToWaitingOrderCheckout() {
        this.router.navigate(['order-checkout/order-checkout-waiting']);
    }
    public NavigateToSearchResult(searchString: string) {
        this.router.navigate(['search-result'], {
           queryParams: {
               searchPhrase: searchString
           }
        });
    }

    public NavigateToAnalogs(productId: string) {
        this.router.navigate(['analogs', productId]);
    }

    public NavigateToProduct(urlEnding: string) {
        this.router.navigate(['product', urlEnding]);
    }

    public OpenProductInNewTab(urlEnding: string) {
        window.open('/product/' + urlEnding, "_blank");
    }

    private NavigateToNotFound() {
        this.router.navigate(['notfound']);
    }

    private NavigateToServerError() {
        this.router.navigate(['server-error']);
    }

    private NavigateToNotAllowed() {
        this.router.navigate(['method-not-allowed']);
    }

    private NavigateToForbidden() {
        this.router.navigate(['forbidden']);
    }

    public NavigateToNewsDetails(news: any) {
        this.router.navigate(["/news", news.id, news.pageUrl]);
    }

    public NavigateToArticle(article: any) {
        this.router.navigate(["/text-articles", article.id, article.pageUrl]);
    }

    public NavigateToCategory(node: any) {
        this.router.navigate(["/category", node.pageURL]);
    }

    public HandleError(error: any): boolean {
        switch (error.status) {
            case 401:
                //this.userStorage.removeUser();
                this.NavigateToLogin();
                break;
            case 403:
                this.NavigateToForbidden();
                break;
            case 404:
                this.NavigateToNotFound();
                break;
            case 405:
                this.NavigateToNotAllowed();
                break;
            case 500:
                this.NavigateToServerError();
                break;
            case 429:
                let counters = error.json();
                this.NavigateToCaptcha(counters.mainBlocker, counters.blocker);
                break;
            default:
                return true;
        }
    }

    public NavigationToResetPassword(id: number) {
        this.router.navigate(["authentication/reset-password"], { queryParams: { id } });
    }

    public NavigateToFindByAuto(vinCode?: string) {
        let params = (vinCode) ? { vinCode: vinCode } : null;
        this.router.navigate(['find-by-auto', params]);
    }

    public NavigateWithQueryParams(route: Array<string>, queryParameters: Object) {
        if (!queryParameters) {
            this.router.navigate(route);
        }
        this.router.navigate(route, queryParameters);
    }

    public NavigateToRefundSteps(order: Order) {
        this.router.navigate(['/refund-main'], { queryParams: { 'id': order.id } });
    }

    public NavigateToRefundList() {
        this.router.navigate(['cabinet/refund']);
    }
}