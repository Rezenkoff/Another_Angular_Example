import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../../../services/user-storage.service';
import { NavigationService } from '../../../services/navigation.service';
import { AuthHttpService } from '../../../auth/auth-http.service';
import { GlobalTransportService, ActionEvent } from '../../../services/global-flag.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'cabinet',
    templateUrl: './__mobile__/mobile-info.component.html',
    styleUrls: ['./__mobile__/styles/mobile-info.component__.scss']
})
export class MobileInfoComponent implements OnInit {
    public userName: string = '';
    public showCabinetInfo: boolean;
    public subscription: Subscription;

    constructor(
        private _transportService: GlobalTransportService,
        private _authService: AuthHttpService,
        private _userStorage: UserStorageService,
        private navigation: NavigationService, 
    ) {
    }

    ngOnInit() {
        //только для мобильного девайса
        if (this._authService.isAuthenticated()) {
 
            this._transportService.emitParcel({ typeFlag: ActionEvent.showInfoBlock, value: false });
       
            this._transportService.emitParcel({ typeFlag: ActionEvent.showOnlyMobileCabinet, value: false });

            let currentUser = this._userStorage.getUser();

            if (currentUser) {
                this.userName = currentUser.name;
            }
        }
    }

    navigateToOrder() {
        this.navigation.NavigateToMobileOrder();
    }

    navigateToVehicle() {
        this.navigation.navigateToMobileVehicle();
    }

    navigateToProfile() {
        this.navigation.navigateToMobileProfile();
    }

    navigateToFordev() {
        this.navigation.navigateToMobileFordev();
    }

    navigateToFavorite() {
        this.navigation.navigateToMobileFavorite();
    }

    navigateToRefund() {
        this.navigation.navigateToMobileRefund();
    }

    public logout() {
        this._authService.logout();
        this.navigation.NavigateToHome();
    }
}
