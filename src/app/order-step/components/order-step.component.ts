import { Component, AfterViewInit, ViewChild, ComponentFactoryResolver, Inject, ComponentRef, OnInit } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { StepHostDirective } from '../../shared/directives/step-host.directive';
import { Step } from '../models/index';
import { OrderStepService } from '../order-step.service';
import { OrderStepComponent1 } from './order-step1.component';
import { OrderStepComponent2 } from './order-step2.component';
import { OrderStepComponent5 } from './order-step5.component';
import { OrderStepBaseComponent } from './order-step-base.component';
import { NavigationService } from '../../services/navigation.service';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { AuthHttpService } from '../../auth/auth-http.service';
import * as carValidator from '../../vehicle/models/car-validator-provider';
import { FindByVinStepComponent } from './find-by-vin-step.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'order-step',
    templateUrl: './__mobile__/order-step.component.html'
})
export class OrderStepComponent extends BaseLoader implements OnInit, AfterViewInit  {

    public currentStepItem: Step = { component: null, isValid: false };
    private currentStepIndex: number = 0;
    private orderId: string = '';
    private orderSecretLinkCode: string = '';
    private steps: Array<Step> = [ ];

    @ViewChild(StepHostDirective) stepHost: StepHostDirective;

    constructor(
        @Inject(APP_CONSTANTS) private constants: IAppConstants,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _orderStepService: OrderStepService,
        private navigation: NavigationService,
        private _authService: AuthHttpService,
        private _activatedRoute: ActivatedRoute
    ) { super(); }

    ngOnInit() {
        let vin = this._activatedRoute.snapshot.queryParams["vin"];
        let firstStep = (vin) ? FindByVinStepComponent : OrderStepComponent1;

        this.steps = [
            { component: firstStep, isValid: false },
            { component: OrderStepComponent2, isValid: false },
            { component: OrderStepComponent5, isValid: false }
        ];

        this._orderStepService.logEnterToFindDetail();
		
		this._orderStepService.logEnterToFindDetail();
    }

    public ConfirmOrder(): void {

        if (this.currentStepItem.isValid && this.currentStepIndex == 2) {//ADC-499
            this.StartSpinning();

            if (!this._authService.isAuthenticated()) {

                this._orderStepService.createConfirmOrderIfUserIsNotAuthentificated().subscribe(() => {

                    this.sendConfirmOrder();

                });
            }

            if (this._authService.isAuthenticated()) {

                this.sendConfirmOrder();
            }
            
        }
    }

    private sendConfirmOrder() {

        this._orderStepService.PostOrder().subscribe(result => {
            this.orderId = result.id;
            this.orderSecretLinkCode = this._authService.isAuthenticated() ? '' : result.link;

            this._orderStepService.resetModel();
            this.invalidateSteps();
            this.navigation.NavigateToSuccessOrder(this.orderId, this.orderSecretLinkCode);
        });
    }

    private invalidateSteps(): void {
        this.steps.every(s => s.isValid = false);
    }

    private validateSteps(): void {        
        this.steps[0].isValid = carValidator.isValidUserCar(this._orderStepService.OrderStepMainModel.Vehicle);
        this.steps[1].isValid = this._orderStepService.OrderStepMainModel.ContactInfo.Comment != null;
        this.steps[2].isValid = this._orderStepService.OrderStepMainModel.ContactInfo.IsAgreed && this._orderStepService.OrderStepMainModel.ContactInfo.Phone != undefined && this._orderStepService.OrderStepMainModel.ContactInfo.Email != undefined;
    }

    public onNextStepClick(): void {
        if (this.currentStepItem.isValid) {
            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++;
                this.loadComponent();
                window.scrollTo(0, 0);
            }
        }
    }

    public onBackStepClick(): void {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.loadComponent();
        }
    }

    public onStepIndexClick(index: number): void {
        if (this.steps[index].isValid) {
            this.currentStepIndex = index;
            this.loadComponent();
        }
    }

    public displayStepStatus(index: number): string {
        if (this.currentStepIndex == index) {
            return this.constants.STYLING.ACTIVE_CLASS;
        }

        if (this.currentStepIndex > index) {
            return this.constants.STYLING.ACTIVE_LINK_CLASS;
        }

        return "";
    }

    public getDisplayNext(): string {
        if (this.currentStepIndex < this.steps.length - 1)
            return this.constants.STYLING.DISPLAY_INLINE_BLOCK;

        return this.constants.STYLING.DISPLAY_NONE
    }

    public getDisplayConfirm(): string {
        if (this.currentStepIndex == this.steps.length - 1)
            return this.constants.STYLING.DISPLAY_INLINE_BLOCK;

        return this.constants.STYLING.DISPLAY_NONE;
    }
   

    ngAfterViewInit() {
        setTimeout( ()=> this.loadComponent(), 100);
        this.validateSteps();
    }

    loadComponent() {
        let stepItem = this.steps[this.currentStepIndex];
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(stepItem.component);
        let viewContainerRef = this.stepHost.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);

        this.currentStepItem = this.steps[this.currentStepIndex];

        (<OrderStepBaseComponent>componentRef.instance).change.asObservable().subscribe((result) => {
            this.currentStepItem.isValid = result;
        });
        this.processMoveEvent(componentRef);        
    }

    private processMoveEvent(componentRef: ComponentRef<any>): void {
        if (!componentRef.instance["moveNext"]) {
            return;
        }
        componentRef.instance["moveNext"].asObservable().subscribe((success: boolean) => {
            this.steps[0] = { component: OrderStepComponent1, isValid: true };
            if (success) {
                this.onNextStepClick();
                return;
            }
            this.onStepIndexClick(0);
        });    
    }
}