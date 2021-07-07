import { KeyValueModel } from '../../models';
import { Observable } from 'rxjs';

export interface IFilter {
    options$: Observable<KeyValueModel[]>;
    type: string;
    selectedOptions: number[];
    searchFilterOptions(searchPhrase: string): void;
    changeOptionState(option: KeyValueModel, event: any): void;
    checkOptions(option: KeyValueModel): boolean;
    getFilterItems(): void;
}