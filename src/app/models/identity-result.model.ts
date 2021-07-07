import { Error } from ".";

export class IdentityResult {
    constructor(
        public succeeded: boolean,
        public errors: Error[]
    ) { }
}