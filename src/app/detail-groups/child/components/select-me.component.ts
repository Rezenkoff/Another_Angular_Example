import { Component, OnInit, Input, Output, Inject, EventEmitter } from '@angular/core';
import { SelectMe } from '../models/select-me.model';
import { AuthHttpService } from '../../../auth/auth-http.service';
import { LastInfoService } from '../../../order-step/last-info.service';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../../translate/custom/alert-translation';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BitrixService } from '../../../services/bitrix.service';
import { AlertService } from '../../../services/alert.service';
import { LanguageService } from '../../../services/language.service';
import { UserStorageService } from '../../../services/user-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CarMark, CarSerie } from '../../../cars-catalog/models';
import { CarCatalogService } from '../../../cars-catalog/services/car-catalog.service';
import { UidParams } from '../../../services/uid-params.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatDialogRef }  from '@angular/material/dialog';;
@Component({
    selector: 'select-me',
    templateUrl: './__mobile__/select-me.component.html',
    styleUrls: ['./__mobile__/styles/select-me.component__.scss']
})

export class SelectMeComponent extends BaseLoader implements OnInit {
    @Input() vin: string;
    @Input() carMark: CarMark;
    @Input() carSerie: CarSerie;
    @Input() startUrl: string;
    public selectPartsForm: FormGroup;
    selectMe: SelectMe = new SelectMe('','','', '', '', null, null);
    public mask = this._constants.PATTERNS.PHONE_MASK;
    public isValid: boolean;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    @Input() startImgUrl: string;
    public imgUrlFull = '';
    public fileNames: string[] = [];
    public files: Array<File> = [];

    constructor(
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        public _bitrixService: BitrixService,
        public _alertService: AlertService,
        public _languageService: LanguageService,
        public _router: Router,
        public fb: FormBuilder,
        public _authService: AuthHttpService,
        public _lastinfo: LastInfoService,
        public _localStorage: UserStorageService,
        public _carCatalogService: CarCatalogService,
        public _activatedRoute: ActivatedRoute,
        public _uidParams: UidParams,
        public _http: HttpClient,
        public dialogRf: MatDialogRef<any>
    ) {
        super();
    }

    ngOnInit() {

        if (this._authService.isAuthenticated()) {
            let user = this._localStorage.getUser();    
            this.selectMe.name = user.name;
            let globalOperatorResult = user.phone.substr(0, 3).indexOf('+38')
            this.selectMe.userPhoneNumber = globalOperatorResult == -1 ? user.phone : user.phone.slice(3);
        }
        else {
            this._lastinfo.getLastUserInfo();
        }

        this.selectPartsForm = this.fb.group({
            name: new FormControl(this.selectMe.name, Validators.compose([Validators.required])),
            phone: new FormControl(this.selectMe.userPhoneNumber, Validators.compose([Validators.required])),
            comment: new FormControl(this.selectMe.comment)
        });

        if (this.selectPartsForm.status === 'VALID') {
            this.isValid = this.selectPartsForm.valid;
            this.change.emit(this.isValid);
        }

        this.selectPartsForm.valueChanges.subscribe(data => {
            this.selectMe.name = data.name;
            this.selectMe.userPhoneNumber = data.phone;
            this.selectMe.comment = data.comment;
            this.selectMe.vin = this.vin;
           
            if (!this._authService.isAuthenticated()) {
                this._lastinfo.rememberLastUserInfo();
            }

            this.isValid = this.selectPartsForm.valid;
            this.change.emit(this.isValid);
        });  
        this.getImgCar();
    }

    private getImgCar(): void{
        if (this.carMark && this.carSerie) {
            this._carCatalogService.getModelsForSerie(this.carMark.markKey, this.carSerie.serieKey).subscribe(result => {
                if (result) {
                    let modelId = this.getIdFromKey(result.modelKey);
                    this.imgUrlFull = `https://cdn.autodoc.ua/models/${modelId}.jpg`;
                }
            });
        }
        else {
            let params = this._activatedRoute.snapshot.params;
            let carMark = (params['carMark'] || '').split('--')[0];
            let carSerie = (params['carSerie'] || '').split('--')[0];
            this._carCatalogService.getModelsForSerie(carMark, carSerie).subscribe(result => {
                if (result) {
                    let modelId = this.getIdFromKey(result.modelKey);
                    this.imgUrlFull = `https://cdn.autodoc.ua/models/${modelId}.jpg`;
                }
            });
        }
    }

    private getIdFromKey(modelKey: string) {
        let sections = modelKey.split('--');
        if (sections.length > 0) {
            var keyStr = sections[0];
            var startIdx = keyStr.indexOf('-id') + '-id'.length;
            var length = keyStr.length - startIdx;
            var id = keyStr.substring(startIdx);
            return id;
        }
        else {
            return null;
        }
    }

    public confirmSelectMe(): void {

        if (this.selectPartsForm.status === 'VALID') {
            let message: string;
            let language = this._languageService.getSelectedLanguage().name;

            this.selectMe.currentUrl = this._router.url;
            this.selectMe.vin = this.vin;
            this.selectMe.carMark = this.carMark;
            this.selectMe.carSerie = this.carSerie;

            if (!this._authService.isAuthenticated()) {

                this.CreateSelectMeIfUserIsNotAutentificated(message, language);
            }

            if (this._authService.isAuthenticated()) {

                this.CreateSelectMeIfUserIsAutentificated(message, language); 
            }
        }
    }

    public CreateSelectMeIfUserIsNotAutentificated(message: string, language: string) {

        const params = new HttpParams().set('userPhone', this.selectMe.userPhoneNumber);

      this._http.get(environment.apiUrl + "crm/uid/getuid", { params: params, responseType: "text" }).subscribe((uidResult: any) => {

            let uid = uidResult._body;
            this._uidParams.setCurrentUnauthorizeUid(uid);
            this._localStorage.checkUidParam();
            this.sendConfirmInfo(message, language);
        });
    }

    public CreateSelectMeIfUserIsAutentificated(message: string, language: string) {

        this.sendConfirmInfo(message, language);
    }

    public sendConfirmInfo(message: string, language: string) {

        if (this.carMark) {

            this._bitrixService.createSelectMeCarCatalogLead(this.selectMe, this.files, this.startImgUrl)
                .subscribe(data => {
                    this.inProcess = false;
                    if (data == null) {
                        this._alertService.error("ОШИБКА СЕРВЕРА");
                    }
                    else if (data.success) {
                        message = this._translations.SUCCESS[`success_callback_${language}`] || "Спасибо, ожидайте звонка менеджера";
                        this._alertService.success(message);
                        this.fileNames.forEach(f => {
                            this.deleteFile(f);
                        });
                        this.selectMe.comment = '';
                        this.selectPartsForm = this.fb.group({
                            name: new FormControl(this.selectMe.name, Validators.compose([Validators.required])),
                            phone: new FormControl(this.selectMe.userPhoneNumber, Validators.compose([Validators.required])),
                            comment: new FormControl(this.selectMe.comment)
                        });
                        this.close();
                    }
                    else
                        this._alertService.error(data.error);
                });
        }
        else {
            this._bitrixService.createSelectMeLead(this.selectMe)
                .subscribe((data:any) => {
                    this.inProcess = false;
                    if (data.success) {
                        message = this._translations.SUCCESS[`success_callback_${language}`] || "Спасибо, ожидайте звонка менеджера";
                        this._alertService.success(message);
                        this.close();
                    }
                    else
                        this._alertService.error(data.error);
                });
        }
    }
  
    public deleteFile(fileName: string) {
        let newFileNameList = [];
        let newFileList = [];
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].name !== fileName) {
                newFileList.push(this.files[i]);
                newFileNameList.push(this.files[i].name);
            }
        }
        this.files = newFileList;
        this.fileNames = newFileNameList;
    }

  private checkFilesSize(files: any): boolean {
    let filesArray = [].slice.call(files);

    if (this.files.length > 0) {

      filesArray.push(...this.files);
    }

    return filesArray.map(f => f.size).reduce((a, b) => a + b, 0) < this._constants.FILE.MAX_SIZE;
  }

  public fileChangeEvent(fileIn: any): void {

    if (fileIn.target.files.length != 0 && this.checkFilesSize(fileIn.target.files)) {

      for (let file of fileIn.target.files) {

        this.files.push(file);
        this.fileNames.push(file.name);
      }
    }
    else if (!this.checkFilesSize(fileIn.target.files)) {
      let language = this._languageService.getSelectedLanguage().name;
      let message = this._translations.ERRORS[`max_file_size_exceeded_${language}`] || 'Превышен максимальный размер файлов';
      this._alertService.error(message);
    }
  }
    public close(): void {
        this.dialogRf.close();
    }
}
