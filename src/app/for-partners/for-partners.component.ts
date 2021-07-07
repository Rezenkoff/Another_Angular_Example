import { Component, OnDestroy, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
    selector: 'for-partners',
    templateUrl: './__mobile__/for-partners.component.html'
})
export class ForPartnersComponent implements OnDestroy {

    private contentPlaceholder: ElementRef;

    @ViewChild('bitrixform') set content(content: ElementRef) {
        if(content) { 
            this.contentPlaceholder = content;

            let url = environment.production ? 'https://crm.autodoc.ua/upload/crm/form/loader_19_ejwned.js' : 'https://beta-crm.autodoc.ua/upload/crm/form/loader_15_dlab6h.js';
            let script = this._renderer2.createElement('script');
            script.text = `
                (function(w,d,u){
                    var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
                    var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
                })(window,document,'${url}');`;

            this._renderer2.setAttribute(script, "data-skip-moving", "true");
            this._renderer2.setAttribute(script, 'data-b24-form', environment.production ? 'inline/19/ejwned' : 'inline/15/dlab6h');
            this._renderer2.appendChild(this.contentPlaceholder.nativeElement, script);
            }
    }

    constructor(private _renderer2: Renderer2) { }

    ngOnDestroy() {
        this.contentPlaceholder.nativeElement.innerHTML = '';
    }
}
