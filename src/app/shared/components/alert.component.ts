import {
    Component,
    Inject
} from '@angular/core';
import {
    trigger,    
    style,
    animate,
    transition,
    keyframes
} from '@angular/animations';
import { Alert } from '../../models/alert.model';
import { AlertType } from '../../models/alert.model';
import { AlertService } from '../../services/alert.service';
import { APP_CONSTANTS, IAppConstants } from '../../config';

@Component({
    selector: 'alert',
    templateUrl: './__mobile__/alert.component.html',
    animations: [

        trigger('showAlert', [
            transition('void => *', [
                animate(300, keyframes([
                    style({ opacity: 0 }),
                    style({ opacity: 1 })
                ]))
            ]),

            transition('* => void', [
                animate(300, keyframes([
                    style({ opacity: 1 }),
                    style({ opacity: 0 })
                ]))
            ])
        ])
    ]
})

export class AlertComponent {
    public alerts: Alert[] = [];

    constructor(
        private alertService: AlertService,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants
    ) { }

    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                this.alerts = [];
                return;
            }

            this.alerts.push(alert);

            let lifeTime = this._constants.ALERT.SHORTLIFETIME;

            if(alert.type == AlertType.Success)
            {
                lifeTime = this._constants.ALERT.LONGLIFETIME;
            }

            // remove alert in few seconds
            setTimeout(() => this.removeAlert(alert), lifeTime);
        });
    }

    private removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    private cssClass(alert: Alert): string {
        if (!alert) {
            return;
        }

        switch (alert.type) {
            case AlertType.Success:
                return 'notification-success';
            case AlertType.Error:
                return 'notification-danger';
            case AlertType.Info:
                return 'notification-info';
            case AlertType.Warning:
                return 'notification-warning';
        }
    }

    private iconClass(alert: Alert): string {
        if (!alert) {
            return;
        }

        switch (alert.type) {
            case AlertType.Success:
                return 'glyphicon glyphicon-ok';
            case AlertType.Error:
                return 'glyphicon glyphicon-remove';
            case AlertType.Info:
                return 'glyphicon glyphicon-bell';
            case AlertType.Warning:
                return 'glyphicon glyphicon-exclamation-sign';
        }
    }
}