import { Component,  OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, HostListener, Renderer2 } from '@angular/core';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthHttpService } from '../../auth/auth-http.service';
import { NavigationService } from '../../services/navigation.service';
import { MatDialog } from '@angular/material/dialog';
import { CatalogPopupComponent } from '../catalog/catalog-popup.component';
import * as fromVehicle from '../../vehicle/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { UserStorageService } from '../../services/user-storage.service';
import { GlobalTransportService, ActionEvent } from '../../services/global-flag.service';

@Component({
    selector: 'auto-doc-header',
    templateUrl: './__mobile__/header.component.html'
})

@HostListener('window:scroll', ['$event'])

export class HeaderComponent implements OnInit {
    @ViewChild('catalog') catalog: ElementRef;
    public carsCount$: Observable<number>;
    public aplayFixed: Boolean = false;
    public userName: string = '';
    public showHeader: boolean = true;
    private menuIsOpen = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public serverParamsService: ServerParamsTransfer,
        private _authHttpService: AuthHttpService,
        private _navigationService: NavigationService,
        private _dialog: MatDialog,
        private _vehicleStore: Store<fromVehicle.State>,
        private _router: Router,
        private _renderer: Renderer2,
        private _storage: UserStorageService,
        public _transportService: GlobalTransportService,
    ) {
        this.carsCount$ = this._vehicleStore.select(fromVehicle.getActiveUserVehiclesCount);
    }

    ngOnInit() {  

        if (isPlatformBrowser(this.platformId)) {
            this._router.events.subscribe((event) => {

                if (event instanceof NavigationEnd) {
                    
                    this.hideMenu();

                    if (this.serverParamsService.serverParams.isMobileDevice && this._authHttpService.isAuthenticated() && this.menuIsOpen) {
            
                        this.showMenu();
                        this.menuIsOpen = false;
                    }
                }
            });

            this._transportService.subscribeToGlobalTransport().subscribe(parcel => {
              
                if (this._authHttpService.isAuthenticated()) {

                    if (parcel && parcel.typeFlag == ActionEvent.showMainMobileMenu && this.serverParamsService.serverParams.isMobileDevice) {

                        this.menuIsOpen = parcel.value;
                        this.showMenu();
                    }
                }
            });

            if (this._authHttpService.isAuthenticated()) {

                let currentUser = this._storage.getUser();

                if (currentUser) {
                    this.userName = currentUser.name;
                }
            }
        }   
    }

    isLogin() {
        return this._authHttpService.isAuthenticated();
    }

    public subject: any;
    public isBrowser = isPlatformBrowser(this.platformId);
    public menuShown: boolean = false;
    private _renderFinished: boolean = false;

    public get isAuthenticated(): boolean {
        return this._authHttpService.isAuthenticated();
    }

    logout() {
        this._transportService.emitParcel({ typeFlag: ActionEvent.showOnlyMobileCabinet, value: true });
        this._authHttpService.logout();
        this._navigationService.NavigateToHome();
    }

    //onWindowScroll(event) {
    //    if (window.pageYOffset > 1) {
    //        this.aplayFixed = true;
    //    }
    //    else {
    //        this.aplayFixed = false;
    //    }
    //}

    openCatalogList() {
        let dialogRef = this._dialog.open(CatalogPopupComponent, {});

        dialogRef.afterClosed().subscribe(backToMenu => {
            if (!backToMenu)
                this.hideMenu();
        })
    }

    public Authenticated(): boolean {
        return this.isAuthenticated;
    }

    public showMenu(): void {
        this.menuShown = true;
    }

    public hideMenu(): void {
        this.menuShown = false;
    }    
}
