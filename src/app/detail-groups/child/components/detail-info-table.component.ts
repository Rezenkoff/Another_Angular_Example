import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DetailInfoModel } from '../models/detail-info.model';
import { Router } from '@angular/router';

@Component({
    selector: 'detail-info-table',
    templateUrl: './__mobile__/detail-info-table.component.html',
    styleUrls: ['./__mobile__/styles/detail-info-table.component__.scss']
})

export class DetailInfoTableComponent implements OnInit {
    @Input() detailInfoList: Array<DetailInfoModel>;    
    @Input() showHead: boolean = true;
    @Output() rowHover: EventEmitter<string> = new EventEmitter<string>();
    @Output() rowLeave: EventEmitter<string> = new EventEmitter<string>();
    isMobileScreen: boolean = false;
    highlightedDetails: any = [];

    constructor(private _router: Router) { }

    ngOnInit() {
        this.isMobileScreen = (window.innerWidth > 767) ? false : true;
    }

    onRowHover(codeonimage: string) {
        if (!codeonimage) {
            return;
        }
        this.highlightTableElement(codeonimage);
        this.rowHover.emit(codeonimage);
    }

    onRowLeave(codeonimage: string) {
        if (!codeonimage) {
            return;
        }
        this.clearHighlights();
        this.rowLeave.emit(codeonimage);
    }

    trimSemicolumns(input: string) {
        if (!input) {
            return;
        }
        return input.replace(new RegExp(';', 'g'), ' ');
    }

    highlightTableElement(code: string) {
        this.clearHighlights();
        this.highlightedDetails = this.detailInfoList.filter(detail => detail.codeonimage === code);
        if (this.highlightedDetails.length === 0) {
            return;
        }
        this.highlightedDetails.map(element => element['isHovered'] = true);
    }

    clearHighlights() {
        if (this.highlightedDetails.length === 0) {
            return;
        }
        for (let i = 0; i < this.highlightedDetails.length; i++) {
            this.highlightedDetails[i]['isHovered'] = false;
        }
        this.highlightedDetails = [];
    }

    getStyle(detail: DetailInfoModel) {
        return detail['isHovered'] ? '#86c934' : null;
    }

    search(oem: string) {
        this._router.navigate(['search-result'], {
            queryParams: {
                searchPhrase: oem
            }
        });
    }
}