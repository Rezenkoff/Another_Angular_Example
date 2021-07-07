import { Component, OnInit, Inject, Input } from '@angular/core';
import { CarMark } from '../models/car-mark.model';
import { CarCatalogService } from '../services/car-catalog.service';
import { CarSerie } from '../../cars-catalog/models';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { Observable, of } from 'rxjs';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { ScrollService } from '../../services/scroll.service';
import { AlphabetCars } from '../models/alphabet-cars.model';

@Component({
    selector: 'cars-catalog-main',
    templateUrl: './__mobile__/cars-catalog-main.component.html',
    styleUrls: ['./__mobile__/styles/cars-catalog-main.component__.scss']
})

export class CarsCatalogMainComponent extends BaseLoader implements OnInit {
    public carsList$: Observable<CarMark[]> = new Observable<CarMark[]>();    
    public alphabet$: Observable<AlphabetCars> = new Observable<AlphabetCars>();
    @Input() title: string;

    constructor(
        private _carCatalogService: CarCatalogService,
        private _scrollService: ScrollService,   
        private serverParamsService: ServerParamsTransfer,
    ) {
        super();
    }

    ngOnInit() {
        this.StartSpinning();
        this.carsList$ = this._carCatalogService.getAllSeries();
        this.carsList$.subscribe(result => {
            this.initializeAlphabet(result);
            this.EndSpinning();
        });
    }

    private getRouteForMark(mark: CarMark): string[] {
        return this._carCatalogService.getRouteForMark(mark);
    }

    private getRouteForCarSerie(mark: CarMark, serie: CarSerie): string[] {
        return this._carCatalogService.getRouteForCarSerie(mark, serie);
    }

    private initializeAlphabet(cars: CarMark[]) {
        const regExIsEngLetter = /[a-zA-Z]/;
        const regExIsRusLetter = /[а-яА-Я]/;

        let alphabet = new AlphabetCars();

        cars.forEach(car => {
            let firstLetter = car.markName[0];

            let isAddToEng = firstLetter && regExIsEngLetter.test(firstLetter) && !alphabet.eng.includes(firstLetter);
            let isAddToRus = firstLetter && regExIsRusLetter.test(firstLetter) && !alphabet.rus.includes(firstLetter);

            if (isAddToEng) {
                alphabet.eng.push(firstLetter);
            }
            if (isAddToRus) {
                alphabet.rus.push(firstLetter);
            }
        });

        this.alphabet$ = of(alphabet);
    }


    public scroll(letter: string) {
        if (this.serverParamsService.serverParams.isMobileDevice) {
           this._scrollService.scrollToElementMobile('letter_' + letter);
       }
        else {
            this._scrollService.scrollToElement('letter_' + letter);
        }
    }

    private getIdFromKey(modelKey: string) {
        let sections = modelKey.split('--');
        if (sections.length > 0) {
            var keyStr = sections[0];
            var startIdx = keyStr.indexOf('-id') + '-id'.length;
            var length = keyStr.length - startIdx;
            var id = keyStr.substring(startIdx);
            return id;
        }
        else {
            return null;
        }
    }
    public letter: string = '';

    public applyFilter(searchString: string): void {
        this.letter = searchString;
        this._carCatalogService.applyFilter(searchString);
    }

    public getCarsByLetter(cars: CarMark[]): CarMark[] {
        if (cars == null)
            return [];

        return cars.filter(car => car.markName.toLowerCase().startsWith(this.letter.toLowerCase()));
    }
}