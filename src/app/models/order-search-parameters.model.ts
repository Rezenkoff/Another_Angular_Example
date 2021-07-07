export class SearchParameters {
    constructor(
        public currentPage: number,
        public pageSize: number,
        public orderBy: string = "",
        public orderArrangement: string = "DESC",
        public languageId: number = 2
    ) { }
}