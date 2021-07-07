import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { UserStorageService } from '../services/user-storage.service';
import { NavigationService } from '../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { AuthHttpService } from '../auth/auth-http.service';
import { GlobalTransportService, ActionEvent } from '../services/global-flag.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'cabinet',
    templateUrl: './__mobile__/cabinet.component.html',
    styleUrls: ['./__mobile__/styles/cabinet.component__.scss']
})
export class CabinetComponent implements OnInit {
    public userName: string = '';
    public showCabinetInfo: boolean;
    public subscription: Subscription;

    constructor(private _transportService: GlobalTransportService,
        private _authService: AuthHttpService,
        private _userStorage: UserStorageService,
        private navigation: NavigationService, private _activatedRoute: ActivatedRoute
    ) {

    }

    ngOnInit() {
        
        if (this._authService.isAuthenticated()) {

            this._transportService.emitParcel({ typeFlag: ActionEvent.showInfoBlock, value: false });
            this._transportService.emitParcel({ typeFlag: ActionEvent.showOnlyMobileCabinet, value: false });

            let currentUser = this._userStorage.getUser();

            if (currentUser) {
                this.userName = currentUser.name;
            }
        }
    }

    ngOnDestroy() {

        this._transportService.emitParcel({ typeFlag: ActionEvent.showOnlyMobileCabinet, value: true })
        this._transportService.emitParcel({ typeFlag: ActionEvent.showInfoBlock, value: true });
    }

    public logout() {

        this._authService.logout();
        this.navigation.NavigateToHome();
    }

}
