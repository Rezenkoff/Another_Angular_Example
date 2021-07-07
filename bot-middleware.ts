import 'zone.js/dist/zone-node';
import { lastmodify } from './src/environments/version';

export class BotRequestProccessMiddleware {
  public serverParams: any = { isMobileDevice: true, isBotRequest: false, isTabletDevice: false };
  public actionConfiguration: any = { logbotdata: false, bypassAdsBot: true };

  private sendNotModifiedCode(response) {    
    return response.sendStatus(304);
  }

  private setLastModifyHeader(response) {
    response.setHeader("Last-Modified", lastmodify.version);
    response.setHeader("Cache-Control","public, must-revalidate");
  }

  public BotMiddleware = (request, response, next)  => {
    this.serverParams.isBotRequest = (/true/i).test(request.headers["x-bot-detected"]);
    let byPass =  !((/true/i).test(request.headers["x-ads-detected"]) && this.actionConfiguration.bypassAdsBot);

    if(this.serverParams.isBotRequest && byPass) {

        this.setLastModifyHeader(response);
      
        let modHeader = request.headers["If-Modified-Since"];
        
        if(modHeader && modHeader == lastmodify.version) {
          return this.sendNotModifiedCode(response); 
        }       
    }

    next();
  }
}


