import { Component, OnInit, Inject } from '@angular/core';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { Brand } from '../models/brand.model';
import { BrandsCatalogService } from '../service/brands-catalog.service';
import { Observable, of } from 'rxjs';
import { Alphabet } from '../models/alphabet.model';
import { ScrollService } from '../../services/scroll.service';
import { ServerParamsTransfer } from '../../server-params-transfer.service';

@Component({
    selector: 'brands-catalog-main',
    templateUrl: './__mobile__/brands-catalog-main.component.html'
})

export class BrandsCatalogMainComponent extends BaseLoader implements OnInit {
    public brandsList$: Observable<Brand[]> = new Observable<Brand[]>();

    public alphabet$: Observable<Alphabet> = new Observable<Alphabet>();

    constructor(
        private _brandsCatalogService: BrandsCatalogService,
        private _scrollService: ScrollService,
        private serverParamsService: ServerParamsTransfer,
    ) {
        super();
    }

    ngOnInit() {
        this.StartSpinning();
        this.brandsList$ = this._brandsCatalogService.getAllBrands();
        this.brandsList$.subscribe(result => {
            this.initializeAlphabet(result);
            this.EndSpinning();
        });
    }

    public applyFilter(searchString: string): void {
        this._brandsCatalogService.applyFilter(searchString);
    }

    public getBrandsByLetter(brands: Brand[], firstLetter: string): Brand[] {
        return brands.filter(x => x.name.startsWith(firstLetter));
    }

    public scroll(letter: string) {
        if (this.serverParamsService.serverParams.isMobileDevice) {
            
            this._scrollService.scrollToElementMobile('letter_' + letter);
        }
       else {
            this._scrollService.scrollToElement('letter_' + letter);
        }
    }

    public getLogo(brand: Brand) {
        if (brand.pictureUrl) {
            return brand.pictureUrl;
        }
        else {
            return 'https://cdn.autodoc.ua/small-logo-1.png';
        }
    }

    private initializeAlphabet(brands: Brand[]) {
        const regExIsDigital = /[0-9]/;
        const regExIsEngLetter = /[a-zA-Z]/;
        const regExIsRusLetter = /[а-яА-Я]/;

        let alphabet = new Alphabet();

        brands.forEach(x => {
            let firstLetter = x.name[0];

            let isAddToEng = firstLetter && regExIsEngLetter.test(firstLetter) && !alphabet.eng.includes(firstLetter);
            let isAddToRus = firstLetter && regExIsRusLetter.test(firstLetter) && !alphabet.rus.includes(firstLetter);
            let isAddToDigitals = firstLetter && regExIsDigital.test(firstLetter) && !alphabet.digitals.includes(firstLetter);

            if (isAddToEng) {
                alphabet.eng.push(firstLetter);
            }
            if (isAddToRus) {
                alphabet.rus.push(firstLetter);
            }
            if (isAddToDigitals) {
                alphabet.digitals.push(firstLetter);
            }
        });

        this.alphabet$ = of(alphabet);
    }
}
