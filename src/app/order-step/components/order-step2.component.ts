import { Component, Inject, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { OrderStepBaseComponent } from './order-step-base.component';
import { OrderStepService } from '../order-step.service';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import { AlertService } from '../../services/alert.service';
import { LanguageService } from '../../services/language.service';

@Component({
    templateUrl: './__mobile__/order-step2.component.html'
})

export class OrderStepComponent2 implements OrderStepBaseComponent, OnInit {
    public isValid: boolean;
    @Output()
    change: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('fileInput')
    myInputVariable: any;
    fileNames: string[] = [];
    hideReset: boolean = true;
    public displayHeight: string;
    private attachedFiles: Array<File> = [];

    constructor(
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        public orderStepService: OrderStepService,
        private _alertService: AlertService,
        private _languageService: LanguageService
    ) { 
        this.displayHeight = this._constants.STYLING.COMMENT_HEIGHT_DISPLAY;
    }

  ngOnInit() {

    if (this.orderStepService.OrderStepMainModel.AttachedFiles.length > 0) {

      for (let file of this.orderStepService.OrderStepMainModel.AttachedFiles) {

        this.attachedFiles.push(file);
        this.fileNames.push(file.name);
      }
      this.hideReset = false;

      this.orderStepService.OrderStepMainModel.AttachedFiles = [];
    }
  }

  ngOnDestroy() {

    this.orderStepService.OrderStepMainModel.AttachedFiles = this.attachedFiles;
  }

    private enableValidation(valid?: boolean): void {
        this.isValid = valid;
        this.change.emit(this.isValid);
    }

  public fileChangeEvent(fileIn: any): void {

    if (fileIn.target.files.length != 0 && this.checkFilesSize(fileIn.target.files)) {

      for (let file of fileIn.target.files) {
        this.attachedFiles.push(file);
        this.fileNames.push(file.name);
      }
      this.hideReset = false;
      this.enableValidation(true);
    }
    else {
      let language = this._languageService.getSelectedLanguage().name;
      let message = this._translations.ERRORS[`max_file_size_exceeded_${language}`] || 'Превышен максимальный размер файлов';
      this._alertService.error(message);
    }
  }

  public reset() {
    this.attachedFiles = [];
    this.myInputVariable.nativeElement.value = "";
    this.fileNames = [];
    this.hideReset = true;
    this.enableValidation(this.orderStepService.OrderStepMainModel.Wishlist != '');
  }

    public onCommentEdit(value: string): void {
        value != '' ? this.enableValidation(true) : this.enableValidation(false);
    }

  public checkFilesSize(files: any): boolean {

    let filesArray = [].slice.call(files);

    if (this.attachedFiles.length > 0) {

      filesArray.push(...this.attachedFiles);
    }
    return filesArray.map(f => f.size).reduce((a, b) => a + b, 0) < this._constants.FILE.MAX_SIZE;
  }
}
