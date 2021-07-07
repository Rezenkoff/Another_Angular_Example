import { Component } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'garantia-i-vozvrat',
    templateUrl: './__mobile__/garantia-i-vozvrat.component.html'
})

export class GarantiaIVozvratComponent {
    public fileName: string = "Акт-заявка на возврат.xlsx";

    constructor(
        private _scrollService: ScrollService,
        private _orderService: OrderService
    ) { }

    public downloadFileAct(){
        this._orderService.downloadFilesActReturned().subscribe(
            (response: any) => {
              let binaryData = [];
              binaryData.push(response.body);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
              downloadLink.setAttribute('download', this.fileName);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }
          )
    }

    public scrollTo(id: string): void {
        this._scrollService.scrollToElement(id);
    }

    public scrollToMobile(id: string): void {
        this._scrollService.scrollToElement(id);
    }
}
