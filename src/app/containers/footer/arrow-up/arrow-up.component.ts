import { Component, OnInit } from '@angular/core';

declare var jQuery: any;

@Component({
    selector: 'arrow-up',
    templateUrl: './arrow-up.component.html'
})
export class ArrowUpComponent implements OnInit {

    ngOnInit() {
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 1000) {
                jQuery('.arrow-up').fadeIn();
            } else {
                jQuery('.arrow-up').fadeOut();
            }
        });

        jQuery('.arrow-up').click(function () {
            jQuery('html, body').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    }
}