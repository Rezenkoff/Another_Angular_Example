export class ClientInfo {
    FirstLastName: string;
    Email: string;
    Phone: string;
    IsAgreed: boolean;
    Comment: string;
    Uid: string;
    TireFittingDate: string;
        
    constructor(uid?: string, name?: string, email?: string, phone?: string, agreed?: boolean, comment?: string) {
        this.Comment = comment;
        this.Email = email;
        this.FirstLastName = name;
        this.IsAgreed = agreed;
        this.Phone = phone;
        this.Uid = uid;
        this.TireFittingDate = '';

    }
}
