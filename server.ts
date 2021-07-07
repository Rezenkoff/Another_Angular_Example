import 'zone.js/dist/zone-node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs'; 
import { SERVERPARAMS } from './src/app/server.params';
import { BotRequestProccessMiddleware } from './bot-middleware';
const io = require('@pm2/io');

const compress = require("compression");
const botMd = new BotRequestProccessMiddleware();

export function app(): express.Express {
  const server = express();
  const distFolder = join(__dirname, '../../dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  const distBotFolder = join(__dirname, '../../dist/browser');
  const indexBotHtml = join(distBotFolder, 'index.bot.html');

  server.use(compress());
  server.use(botMd.BotMiddleware);
  server.use(io.expressErrorHandler());
  
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
    providers:[{ provide: SERVERPARAMS, useValue: botMd.serverParams}]
  }));

  server.set('etag', false);
  server.set('view engine', 'html');
  server.set('views', distFolder);
 
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('*', (req, res) => { 
    let indexPath = botMd.serverParams.isBotRequest ? indexBotHtml: indexHtml;      

      res.render(indexPath, { 
        req, providers:
          [
            { provide: APP_BASE_HREF, useValue: req.baseUrl },
            { provide: REQUEST, useValue: req },
            { provide: RESPONSE, useValue: res }          
          ] 
      });           
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4310;

  
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express on http://localhost:${port}`);       
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
