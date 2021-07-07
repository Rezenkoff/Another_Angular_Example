import { Component, OnInit, HostListener} from '@angular/core';
import { SpecialPropositionsService } from '../../services/special-propositions.service';
import { SpecialPropositionModel, SpecialPropositionEnums } from '../../models/special-proposition.model';
import {
    trigger,
    style,
    state,
    transition,
    animate,
    keyframes
} from '@angular/animations';


@Component({
    selector: 'special-proposition',
    templateUrl: './__mobile__/specialprop.component.html',
    animations: [       
        trigger('hideBaner', [     
        state('true', style({     
          height: '40px'
        })),
        state('false', style({
            height: '0px'
        })),
        transition('true => false', animate('300ms  cubic-bezier(0.35, 0, 0.25, 1)')),  
        transition('false => true', animate('300ms  cubic-bezier(0.35, 0, 0.25, 1)'))
      ])
    ]  
})

@HostListener('window:scroll', ['$event'])

export class SpecPropComponent implements OnInit {
    public leftImgUrl: string = '';
    public rightImgUrl: string = '';
    public centerImgUrl: string = '';
    public mobileImgUrl: string = '';
    public leftTargetUrl: string = '';
    public rightTargetUrl: string = '';
    public centerTargetUrl: string = '';
    public mobileTargetUrl: string = '';
    public rightBoxImageShow: Boolean = false;
    public leftBoxImageShow: Boolean = false;
    public centerBoxImageShow: Boolean = false;
    public mobileBoxImageShow: Boolean = false;
    public needShow: string = 'true';
    public aplayFixed: Boolean = false;

    constructor(private _specialPropositionsService: SpecialPropositionsService) {  }

    ngOnInit() {
        
        this._specialPropositionsService.getSpecialOffersUrls().subscribe(data => {
            var propositions = data as Array<SpecialPropositionModel>;

            propositions.forEach(p => {
                if (p.keyName == SpecialPropositionEnums.leftImageUrl) {
                    this.leftImgUrl = p.imageUrl;
                    this.leftTargetUrl = p.targetUrl;
                } else if (p.keyName == SpecialPropositionEnums.rightImageUrl) {
                    this.rightImgUrl = p.imageUrl;
                    this.rightTargetUrl = p.targetUrl;
                } else if (p.keyName == SpecialPropositionEnums.centerImageUrl) {
                    this.centerImgUrl = p.imageUrl;
                    this.centerTargetUrl = p.targetUrl;
                    if (p.imageUrl && p.imageUrl != '') {
                        this.centerBoxImageShow = true;
                    }
                } else if (p.keyName == SpecialPropositionEnums.mobileImageUrl) {
                    this.mobileImgUrl = p.imageUrl;
                    this.mobileTargetUrl = p.targetUrl;
                    if (p.imageUrl && p.imageUrl != '') {
                        this.mobileBoxImageShow = true;
                    }
                }
            });          
        })
    }

    onWindowScroll(event) {
        if (this.mobileImgUrl == '' || window.pageYOffset > 35) {
            this.needShow = 'false';
        }
        else
        {
            this.needShow = 'true';
        }
    }
}
