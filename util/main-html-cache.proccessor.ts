import { MongoDataBase } from '../database/database';
import { HtmlPageModel } from "../database/models/html-page.model";

export class MainHtmlCacheProccessor {

    private db:MongoDataBase;

    constructor() {
        this.db = new MongoDataBase();
    }
    public Close() {
        this.db.client.close();
    }
    
    public async CheckIsPageInCache(requestUrl:string) : Promise<HtmlPageModel> {        
        return await this.db.findOneByKey(requestUrl);
    }

    public async InsertOneCacheRegularItem(Key: string, html: string) : Promise<void> {
        const valueModel = new HtmlPageModel().deserialize({Key, html, botHtml: ""});
        await this.db.InsertOne(valueModel);
    }

    public async UpdateOneCacheItemForBot(Key: string, html: string) : Promise<void> {
        const valueModel = new HtmlPageModel().deserialize({Key, html:"", botHtml: html });
        await this.db.UpdateOne(valueModel);
    }
}