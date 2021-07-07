import { Component, Input, ViewChild, SimpleChanges, ViewEncapsulation, OnInit } from '@angular/core';
import { CarouselImage } from '../models/carouselImage.model';
import { CarouselConfig, CarouselComponent } from 'ngx-bootstrap/carousel';

@Component({
    selector: "seo-carousel",
    templateUrl: './__mobile__/seo-carousel.component.html',
    styleUrls: ['./__mobile__/styles/seo-carousel.component__.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: CarouselConfig, useValue: { interval: 0, noPause: true, showIndicators: true } }
    ]
})

export class SeoCarouselComponent implements OnInit {
    @Input('carouselImages') carouselImages: CarouselImage[];
    activeSlideIndex: number = 0;
    indexCorrector: number = 1;       
    loopcomplete: Boolean = false;
    arrayCarouselImages: Array<CarouselImage> = new Array<CarouselImage>();
    isBotRequest: Boolean = false;

    private carousel: CarouselComponent;
    @ViewChild(CarouselComponent) set content(content: CarouselComponent) {
        if (content) {
            this.carousel = content;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.carouselImages.firstChange) {
            this.arrayCarouselImages.push(changes.carouselImages.currentValue[0]);
            if (changes.carouselImages.currentValue.length >= 2) {
                this.arrayCarouselImages.push(changes.carouselImages.currentValue[1]);
            }
        }
    }
   
    public ngOnInit() {
        if(this.carouselImages !== null )
        {
            this.carouselImages.forEach((i,indx) => { 
                i.alt = this.generateAlt(i.description, indx);
                i.title = this.generateTitle(i.description, indx);
            });
        }        
    }

    public gotChange() {
        if (this.carousel) {
            if (!this.loopcomplete) {
                if (this.carousel.activeSlide + 1 < this.carouselImages.length) {
                    this.arrayCarouselImages.push(this.carouselImages[this.carousel.activeSlide + 1]);
                } else { this.loopcomplete = true; }
            }
        }
    }

    public generateAlt(description: string, index: number): string {
        return "Фото " + (this.carouselImages.length > 1 ? ((index + this.indexCorrector) + " ") : "") + (description || "");
    }

    public generateTitle(description: string, index: number): string {
        return (description || "") + " Фото" + (this.carouselImages.length > 1 ? (" " + (index + this.indexCorrector)) : "");
    }

    
}