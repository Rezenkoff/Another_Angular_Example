import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from "rxjs";
import { tap, map, catchError } from 'rxjs/operators';
import { AuthHttpService } from '../auth/auth-http.service';
import { LanguageService } from '../services/language.service';
import { AlertService } from '../services/alert.service';
import { Product } from '../models/product.model';
import { CurrentUser } from '../auth/models';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../translate/custom/alert-translation';
import { environment } from '../../environments/environment';

@Injectable()
export class FavoriteProductService {
    private _favoriteProducts: number[] = [];
    private favoritIsLoaded: boolean = false;
    private currentUser: CurrentUser;

    constructor(
        @Inject(ALERT_TRANSLATIONS) public _translations: IAlertTranslations,
        private _http: HttpClient,
        private _authService: AuthHttpService,
        private _languageService: LanguageService,
        private _alertService: AlertService,
    ) { }

    public loadFavoritProducts(): Observable<number[]> {
        if (this._authService.isAuthenticated()) {
            if (this.favoritIsLoaded && this.currentUser && this.currentUser.phone == this._authService.getCurrentUser().phone) {
                return of(this._favoriteProducts);
            }
            else {
                this.currentUser = this._authService.getCurrentUser() as CurrentUser;
                return this.getFavoriteProducts().pipe(tap(data => {
                    this.favoritIsLoaded = true;
                    this._favoriteProducts = data as number[];
                    return of(this._favoriteProducts);
                }));
            }
        }
        else {
            this._favoriteProducts = [];
            this.currentUser = null;
            return of(this._favoriteProducts);
        }
    }

    public upsertFavoritList(product: Product) {
        let operation: FavoriteProductOperationsEnum = FavoriteProductOperationsEnum.Add; 
        if (this._favoriteProducts && this._favoriteProducts.length > 0) {
            var exist = this._favoriteProducts.find(function (el) {
                return el === product.id;
            });
            if (!exist)
                this._favoriteProducts.push(product.id);
            else {
                var index = this._favoriteProducts.indexOf(product.id);
                this._favoriteProducts.splice(index, 1);
                operation = FavoriteProductOperationsEnum.Remove; 
            }
        }
        else {
            this._favoriteProducts.push(product.id);
        }
        this.upsertFavoritProduct(product.id, operation).subscribe(data => {
            let language: string = this._languageService.getSelectedLanguage().name || 'RUS';
            let message = product.isFavorite ? this._translations.MESSAGE[`add_to_favorite_${language}`] : this._translations.MESSAGE[`remove_from_favorite_${language}`];
            this._alertService.success(message);
        });
    }

    public removeFavoriteProduct(product: Product): void {
        this.upsertFavoritProduct(product.id, FavoriteProductOperationsEnum.Remove).subscribe(data => {
            let language: string = this._languageService.getSelectedLanguage().name || 'RUS';
            let message =this._translations.MESSAGE[`remove_from_favorite_${language}`];
            this._alertService.success(message);
        });
    }

    public getFavoriteProducts(): Observable<number[]> {
        return this._http.get<number[]>(environment.apiUrl + 'product/favoritelist').pipe(
            map(resp => resp),
            catchError((error: any) => throwError(error))
        );
    }

    public upsertFavoritProduct(productId: number, operation: FavoriteProductOperationsEnum): Observable<number> {
        var favoritmodel = {
            ProductId: productId,
            Operation: operation
        };

        return this._http.post<number>(environment.apiUrl + 'product/upsert/favorite', JSON.stringify(favoritmodel)).pipe(
            map(resp => resp),
            catchError((error: any) =>
                throwError(error)
        ));
    }

    public getFavoriteProductsList(): Observable<Product[]> {
        return this._http.get<Product[]>(environment.apiUrl + 'product/favoriteproductlist').pipe(
            map(resp => resp.map(i => new Product().deserialize(i))),
            catchError((error: any) => throwError(error))
        );
    }
}

enum FavoriteProductOperationsEnum {
    Remove = 0,
    Add = 1
}