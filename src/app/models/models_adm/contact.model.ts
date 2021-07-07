export class ContactModel {
    id: number = 0;    
    contactText: string;
    contactType: number = 1;
    status: string = "unchanged"; //possible options: unchanged, updated, new, removed

    constructor(contactType: number, contactText: string, status: string) {
        this.contactText = contactText;
        this.contactType = contactType || 1;
        this.status = status || "unchanged";
    }
}