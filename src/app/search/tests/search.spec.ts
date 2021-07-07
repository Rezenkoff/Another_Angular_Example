//import * as search from '../actions/search.actions';
//import * as reducer from '../reducers/search.reducer';
//import { Observable } from 'rxjs/Observable';
//import { } from 'jest';
//import { assert } from 'chai';
//import { SearchParameters } from '../models/search-parameters.model';
//import { Product } from '../../models';

//describe('search reducer', () => {

//    const initialState = {
//        searchParameters: new SearchParameters(),
//        products: []
//    };

//    const products = [];
//    const product = new Product(0, 0, 'testNumber', 'displayDescription', 'trTittle', 'qaz', 'brId', 0);
//    products.push(product);

//    const searchParameters = new SearchParameters();
//    searchParameters.cartManufacturers.push(1);
//    const mInitialState = {
//        searchParameters: searchParameters,
//        products: []
//    };

//    it('should return the initial state', () => {
//        expect(reducer.reducer(undefined, { type: undefined })).toEqual(
//            {
//                searchParameters: { searchPhrase: '', cartManufacturers: [] },
//                products: []
//            }
//        )
//    })

//    it('set search phrase', () => {
//        expect(reducer.reducer(initialState, new search.SetSearchPhraseAction('test'))).toEqual(
//            {
//                searchParameters: { searchPhrase: 'test', cartManufacturers: [] },
//                products: []
//            }
//        )
//    })

//    it('set success result', () => {
//        expect(reducer.reducer(initialState, new search.SetSuccessResultAction(products))).toEqual(
//            {
//                searchParameters: { searchPhrase: '', cartManufacturers: [] },
//                products: [{ id: 0, price: 0, lookupNumber: 'testNumber', displayDescription: 'displayDescription', TransliteratedTitle: 'trTittle', brandId: 'brId', groupId: 0, brand: 'qaz' }]
//            }
//        )
//    })

//    it('set manufacturer id', () => {
//        expect(reducer.reducer(initialState, new search.SetManufacturersIdAction(1))).toEqual(
//            {
//                searchParameters: { searchPhrase: '', cartManufacturers: [1] },
//                products: []
//            }
//        )
//    })

//    it('remove manufacturer id', () => {
//        expect(reducer.reducer(mInitialState, new search.RemoveManufacturerIdAction(1))).toEqual(
//            {
//                searchParameters: { searchPhrase: '', cartManufacturers: [] },
//                products: []
//            }
//        )
//    })

//    it('remove manufacturer id', () => {
//        expect(reducer.reducer(mInitialState, new search.ResetManumacturers())).toEqual(
//            {
//                searchParameters: { searchPhrase: '', cartManufacturers: [] },
//                products: []
//            }
//        )
//    })
//});