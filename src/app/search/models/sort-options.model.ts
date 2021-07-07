import { SortOrderEnum } from "./sort-order.enum";

export class SortOptionsModel {
    sortField: string = '';
    sortOrder: SortOrderEnum = SortOrderEnum.Ascending;
}