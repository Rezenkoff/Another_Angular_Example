import { enableProdMode, Injector } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppBrowserModule } from './app/app.browser.module';
import { environment } from './environments/environment';
import { SERVERPARAMS } from '../src/app/server.params';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  { provide: SERVERPARAMS, useValue: {} }
];

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic(providers).bootstrapModule(AppBrowserModule)
  .catch(err => console.error(err));
});
