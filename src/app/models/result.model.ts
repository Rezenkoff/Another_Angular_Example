export class Result {
    constructor(
        public success: boolean,
        public errors: string[],
        public data: any
    ) { }
}