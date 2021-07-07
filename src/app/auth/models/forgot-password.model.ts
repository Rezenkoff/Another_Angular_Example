export class ForgotPassword {
    constructor(
        public emailContactRecover: string,
        public smsContactRecover: string,
        public typeRecover: string)
    { }
}