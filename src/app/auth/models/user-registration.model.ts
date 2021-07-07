export class UserRegistration {
    constructor(
        public phone: string,
        public email: string,
        public firstLastName: string,
        public password: string,
        public confirmPassword: string,
        public userRegistration: boolean
    ) { }
}