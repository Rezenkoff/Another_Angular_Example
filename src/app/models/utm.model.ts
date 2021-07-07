export class UtmModel {       
    Utm_source: string;
    Utm_medium: string;
    Utm_campaign: string;
    Utm_term: string;
    Utm_content: string;
    public Utm_error: string;

    constructor(Utm_source: string, Utm_medium: string, Utm_campaign: string, Utm_term: string, Utm_content: string, Utm_error?: string)
    {
        this.Utm_source = Utm_source;
        this.Utm_medium = Utm_medium;
        this.Utm_campaign = Utm_campaign;
        this.Utm_term = Utm_term;
        this.Utm_content = Utm_content;
        this.Utm_error = Utm_error;
    }
}