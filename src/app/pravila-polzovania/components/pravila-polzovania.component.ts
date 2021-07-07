import { Component, Renderer2, ElementRef, ViewChild, OnDestroy, Inject, RendererFactory2 } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'pravila-polzovania',
    templateUrl: './__mobile__/pravila-polzovania.component.html',
    styleUrls: ['./__mobile__/styles/pravila-polzovania.component__.scss']
})
export class PravilaPolzovaniaComponent implements OnDestroy {

    constructor(private _renderer2: Renderer2) { }

    public isCollapsedRules: boolean = false;
    public isCollapsedContacts: boolean = false;
    public isCollapsedRegulatory: boolean = false;

    private contentPlaceholder: ElementRef;

    @ViewChild('bitrixform') set content(content: ElementRef) {
        if(content) { 
            this.contentPlaceholder = content; 
            
            let url = environment.production ? 'https://crm.autodoc.ua/bitrix/js/crm/form_loader.js' : 'https://beta-crm.autodoc.ua/bitrix/js/crm/form_loader.js';
            let script = this._renderer2.createElement('script');
            script.id = `bx24_form_inline`;
            script.text = `
                (function(w,d,u,b){w['Bitrix24FormObject']=b;w[b] = w[b] || function(){arguments[0].ref=u;
                    (w[b].forms=w[b].forms||[]).push(arguments[0])};
                    if(w[b]['form']) return;
                    var s=d.createElement('script');s.async=1;s.src=u+'?'+(1*new Date());
                    var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
            })(window,document,'${url}','b24form');

            b24form({"id":"2","lang":"ru","sec":"mn4sfp","type":"inline"});`;

            this._renderer2.setAttribute(script, "data-skip-moving", "true");
            this._renderer2.appendChild(this.contentPlaceholder.nativeElement, script);
        }
    }

    public ngOnDestroy() {
        this.contentPlaceholder.nativeElement.innerHTML = '';
    }

    public toggleCollapseRules(): void {
        this.isCollapsedRules = !this.isCollapsedRules;
    }

    public toggleCollapseContacts(): void {
        this.isCollapsedContacts = !this.isCollapsedContacts;
    }

    public toggleCollapseRegulatory(): void {
        this.isCollapsedRegulatory = !this.isCollapsedRegulatory;
    }    
}