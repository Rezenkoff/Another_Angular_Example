import { Array } from "core-js";

export class KeyValuePair {
    key: number;
    value: string;
}

export class ResponseImagesForProducts {

    public result: Array<KeyValuePair>;

    public success: boolean;

    public reason: string;

    constructor() {
       this.result = [];
    }
}