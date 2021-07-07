import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { DetailGroupModel } from '../models/detail-group.model';
import { DetailInfoModel } from '../models/detail-info.model';
import { LaximoService } from '../../../services/laximo.service';
import { ImageMapModel } from '../models/image-map.model';
import { MappedImageComponent } from './mapped-image.component';
import { DetailInfoTableComponent } from './detail-info-table.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'detail-info',
    templateUrl: './__mobile__/detail-info.component.html'
})

export class DetailInfoComponent implements OnInit {
    @Input() detailInfo: DetailGroupModel;
    @Input() code: string;
    @Output() backFromDetailInfo: EventEmitter<boolean> = new EventEmitter<boolean>();
    imageUrl: string;
    @ViewChild('newImgMap') newImgMap: MappedImageComponent;
    @ViewChild('mainDetailsTable') mainDetailsTable: DetailInfoTableComponent;
    @ViewChild('otherDetailsTable') otherDetailsTable: DetailInfoTableComponent;
    imageMapping: Array<ImageMapModel>;
    zoomed = false;
    additionalDetailsIsShown: boolean;
    detailInfoMain: Array<DetailInfoModel> = new Array<DetailInfoModel>();
    detailInfoOther: Array<DetailInfoModel> = new Array<DetailInfoModel>();
    private destroy$ = new Subject<boolean>();

    constructor(private _laximoService: LaximoService) { }

    ngOnInit() {
        this.additionalDetailsIsShown = false;
        this.fillDetailInfoArrays();
        this.imageUrl = this.detailInfo.imageurl.replace('%size%', 'source');
        this.setImageMappig();
    }

    setImageMappig() {
        this._laximoService.GetImageMapping(this.code, this.detailInfo.ssd, this.detailInfo.unitid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(resp => {
                if (!resp['row']) {
                    return;
                }
                this.imageMapping = resp['row'] as Array<ImageMapModel>;
            })
    }

    fillDetailInfoArrays() {
        for (let detail of this.detailInfo.Detail) {
            if (detail.match) {
                this.detailInfoMain.push(detail);
            }
        }
    }

    goBack() {
        this.backFromDetailInfo.emit(true);
    }

    onRowHover(picturenumber: string) {
        if (picturenumber) {
            if (this.mainDetailsTable) {
                this.mainDetailsTable.highlightTableElement(picturenumber);
            }
            if (this.otherDetailsTable) {
                this.otherDetailsTable.highlightTableElement(picturenumber);
            }
            if (this.newImgMap) {
                this.newImgMap.clear(picturenumber);
                this.newImgMap.draw(picturenumber);
            }
        }
    }

    onRowLeave(picturenumber: string) {
        if (this.mainDetailsTable) {
            this.mainDetailsTable.clearHighlights();
        }
        if (this.otherDetailsTable) {
            this.otherDetailsTable.clearHighlights();
        }
        if (picturenumber && this.newImgMap) {
            this.newImgMap.clear(picturenumber);
        }
    }

    showImage() {
        this.zoomed = true;
    }

    hideImage() {
        this.zoomed = false;
    }

    additionalDetailsShown(): boolean {
        return this.additionalDetailsIsShown;
    }

    showAdditionalDetails() {
        if (this.detailInfoOther.length == 0)
            this._laximoService.GetUnitItems(this.code, this.detailInfo.ssd, this.detailInfo.unitid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(resp => {
                this.detailInfoOther = resp['row'] as Array<DetailInfoModel>;
            });
        this.additionalDetailsIsShown = true;
    }

    hideAdditionalDetails() {
        this.additionalDetailsIsShown = false;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}