import { UserPreferencesModel } from "./user-preferences.model";

export class UserResponseModel {
    public phone: string;
    public uid: string;
    public role: string;
    public email: string;
    public firstLastName: string;
    public isOfferAgreed: boolean;
    public preferences: UserPreferencesModel;
}