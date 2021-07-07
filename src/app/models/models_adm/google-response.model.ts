import { Result } from ".";

export class GoogleResponse {
    constructor(
        public results: Result[],
        public status: string) { }
}