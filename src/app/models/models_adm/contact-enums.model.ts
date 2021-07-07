import { InjectionToken } from "@angular/core";

export let CONTACT_ENUMS= new InjectionToken("CONTACT.ENUMS");

export interface IContactEnums {
    ContactTypes: {
        Phone: number
    };
    Statuses: {
        New: string,
        Unchanged: string,
        Updated: string,
        Removed: string
    };

}

export const ContactEnums: IContactEnums = {
    ContactTypes: {
        Phone: 1   
    },
    Statuses: {
        New: "New",
        Unchanged: "Unchanged",
        Updated: "Updated",
        Removed: "Removed"
        }
}
