import { Component, Inject, AfterViewInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IAppConstants, APP_CONSTANTS } from '../../config';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { Step } from '../models/step.model';
import { RefundStep1Component, RefundStep2Component, RefundStep3Component, RefundStep4Component } from './steps';
import { ActivatedRoute } from '@angular/router';
import { StepHostDirective } from '../../shared/directives/step-host.directive';
import { RefundStepService } from '../refund-step.service';
import { IRefundStep } from './steps/refund-step.interface';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'refund-step',
    templateUrl: './__mobile__/refund-step.component.html'
})

export class RefundStepComponent extends BaseLoader implements AfterViewInit {

    currentStepIndex: number = 0;
    public currentStep: Step = { component: null, isValid: false };
    public seriesLength: number = 2;
    public numberLength: number = 6;

    private steps: Array<Step> = [
        { component: RefundStep1Component, isValid: false },
        { component: RefundStep2Component, isValid: false },
        { component: RefundStep3Component, isValid: false },
        { component: RefundStep4Component, isValid: true }
    ];

    @ViewChild(StepHostDirective) stepHost: StepHostDirective;

    constructor(@Inject(APP_CONSTANTS) private constants: IAppConstants,
        private activatedRoute: ActivatedRoute,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _refundStepService: RefundStepService,
        private navigation: NavigationService) {
        super();

        this._refundStepService.refundStepModelReset();
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

    ngAfterViewInit() {
        setTimeout(() => this.loadComponent(), 100);
    }

    public loadComponent() {
        this.currentStep = this.steps[this.currentStepIndex];
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.currentStep.component);
        let viewContainerRef = this.stepHost.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);

        (<IRefundStep>componentRef.instance).change.asObservable().subscribe((result) => {
            this.currentStep.isValid = result;
        });
    }

    public onNextStepClick() {
        if (this.currentStep.isValid) {
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

    private navigateToFirst(): void {
        this.currentStepIndex = 0;
        this.loadComponent();
    }

    public Confirm() {
        this._refundStepService.downloadFile().subscribe(() => {
            this.redirectToRefundList();
        });
    }

    public redirectToRefundList() {
        this.navigation.NavigateToCabinet();
    }
}