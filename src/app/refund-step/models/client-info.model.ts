import { UserInfo } from './user-info.model';
import { UserPassport } from './user-passport.model';

export class ClientInfo {
    user: UserInfo;
    passport: UserPassport

    constructor() {
        this.user = new UserInfo();
        this.passport = new UserPassport();
    }
}