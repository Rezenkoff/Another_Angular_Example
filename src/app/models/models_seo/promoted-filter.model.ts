import { MetaTags } from './meta-tags.model';

export class PromotedFilterModel {
    public url: string;
    public metaTags: MetaTags;
    public typeId: number;
    public typeName: string;
    public positionPriority: number;
    public tagConstructorsHolder: TagConstructorsHolder;
    public textConstructor: TextConstructor;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class TagConstructor {
    public template: string = '';
    public variable: string = '';
}

export class DescriptionTagConstructor extends TagConstructor {
}

export class TitleTagConstructor extends TagConstructor {
}

export class TextConstructor extends TagConstructor {
}

export class TagConstructorsHolder {
    public titleTagConstructor: TitleTagConstructor;
    public descriptionTagConstructor: DescriptionTagConstructor;
    
    constructor() {
        this.titleTagConstructor = new TitleTagConstructor();
        this.descriptionTagConstructor = new DescriptionTagConstructor();        
    }
}