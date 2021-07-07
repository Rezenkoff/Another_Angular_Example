import { Component, Inject, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { AuthHttpService } from "../../auth/auth-http.service";
import { OrderStepService } from "../../order-step/order-step.service";
import { UserStorageService } from "../../services/user-storage.service";
import { AlertService } from "../../services/alert.service";
import { LanguageService } from "../../services/language.service";
import { APP_CONSTANTS, IAppConstants } from "../../config";
import { ALERT_TRANSLATIONS, IAlertTranslations } from "../../translate/custom/alert-translation";
import { CustomValidators } from "../../shared/validators/email.validator";

@Component({
    selector: 'spare-part-select-send-order',
    templateUrl: './__mobile__/spare-part-select-send-order.component.html'
})
export class SparePartSelectSendOrderComponent {

    public orderContactInfoGroup: FormGroup;
    public fileNames: string[] = [];
    private attachedFiles: Array<File> = [];

    public isOrderSending: boolean = false;
    @Output() backToPreviousStep = new EventEmitter<boolean>();
    @Output() isValidOrderSended = new EventEmitter<boolean>();

    constructor(
        private _authHttpService: AuthHttpService,
        private fb: FormBuilder,
        public orderStepService: OrderStepService,
        private _localStorage: UserStorageService,
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _alertService: AlertService,
        private _languageService: LanguageService) {

        this.orderContactInfoGroup = this.fb.group({
            name: new FormControl('', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([])),
            phone: new FormControl('', Validators.compose([CustomValidators.phoneStartsWithPlusValidator])),
        });
    }

    ngOnInit() {
        if (this.isAuthenticated()) {
            let user = this._localStorage.getUser();
            this.orderStepService.OrderStepMainModel.ContactInfo.FirstLastName = user.name;
            this.orderStepService.OrderStepMainModel.ContactInfo.Email = user.email;
            this.orderStepService.OrderStepMainModel.ContactInfo.Phone = user.phone;
        }
        this.orderContactInfoGroup.reset({
            name: this.orderStepService.OrderStepMainModel.ContactInfo.FirstLastName,
            email: this.orderStepService.OrderStepMainModel.ContactInfo.Email,
            phone: this.correctPhoneNumber(this.orderStepService.OrderStepMainModel.ContactInfo.Phone),
        });

        this.orderContactInfoGroup.valueChanges.subscribe(data => {
            this.orderStepService.OrderStepMainModel.ContactInfo.FirstLastName = data.name;
            this.orderStepService.OrderStepMainModel.ContactInfo.Email = data.email;
            this.orderStepService.OrderStepMainModel.ContactInfo.Phone = data.phone;
            this.orderStepService.OrderStepMainModel.ContactInfo.IsAgreed = true;
        });
    }

    public isAuthenticated() {
        return this._authHttpService.isAuthenticated();
    }

  public fileChangeEvent(fileIn: any): void {

    if (fileIn.target.files.length != 0 && this.checkFilesSize(fileIn.target.files)) {

      for (let file of fileIn.target.files) {

        this.attachedFiles.push(file);
        this.fileNames.push(file.name);
      }
    }
    else {
      let language = this._languageService.getSelectedLanguage().name;
      let message = this._translations.ERRORS[`max_file_size_exceeded_${language}`] || 'Превышен максимальный размер файлов';
      this._alertService.error(message);
    }
  }

    public goToPreviousStep() {
        this.backToPreviousStep.emit(true);
    }

  public SendRequest() {

    if (this.isOrderSending) {
      return;
    }

    this.orderStepService.OrderStepMainModel.AttachedFiles = this.attachedFiles;
    this.isOrderSending = true;
    this.isValidOrderSended.emit(this.isValidOrder());
  }

    public isValidOrder() {
        return this.orderContactInfoGroup.valid && this.orderStepService.OrderStepMainModel.Wishlist != '';
    }

    public onCommentEdit(value: string): void {

    }

  public deleteFile(fileName: string) {
    let newFileNameList = [];
    let newFileList = [];

    for (var i = 0; i < this.attachedFiles.length; i++) {
      if (this.attachedFiles[i].name !== fileName) {
        newFileList.push(this.attachedFiles[i]);
        newFileNameList.push(this.attachedFiles[i].name);
      }
    }
    this.attachedFiles = newFileList;
    this.fileNames = newFileNameList;
  }

  private checkFilesSize(files: any): boolean {

    let filesArray = [].slice.call(files);

    if (this.attachedFiles.length > 0) {

      filesArray.push(...this.attachedFiles);
    }

    let res = filesArray.map(f => f.size).reduce((a, b) => a + b, 0);
    return filesArray.map(f => f.size).reduce((a, b) => a + b, 0) < this._constants.FILE.MAX_SIZE;
  }

    private correctPhoneNumber(phoneNumber: string) {
        if (!phoneNumber || phoneNumber.length === 0) {
            return '+380';
        }
        if (phoneNumber.startsWith('+380')) {
            return phoneNumber;
        }
        if (phoneNumber.startsWith('0')) {
            return '+38' + phoneNumber;
        }
    }
}
