export class CookieModel {
    public utmz: Utmz;
    public cookie_error: string;
}

export class Utmz {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;

    constructor(Utm_source: string, Utm_medium: string, Utm_campaign: string, Utm_term: string, Utm_content: string) {
        this.utm_source = Utm_source;
        this.utm_medium = Utm_medium;
        this.utm_campaign = Utm_campaign;
        this.utm_term = Utm_term;
        this.utm_content = Utm_content;
    }
}