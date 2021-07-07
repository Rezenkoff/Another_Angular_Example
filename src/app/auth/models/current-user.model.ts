import { UserPreferencesModel } from "./user-preferences.model";

export class CurrentUser {
    constructor(
        public uid: string,
        public phone: string,
        public role: string,
        public token: string,
        public email: string,
        public name: string,
        public isOfferAgreed: boolean,
        public expiresIn: string,
        public userPreferences: UserPreferencesModel
    ) { }
}