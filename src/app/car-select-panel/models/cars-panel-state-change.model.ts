import { StrKeyValueModel } from "../../models/key-value-str.model";

export class CarsPanelStateChange {
    filterType: string;
    selectedOptions: StrKeyValueModel[] = [];
}