import { NgModule } from '@angular/core';
import { AppComponent } from './app-root/app.component';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { AppModule } from './app.module';

@NgModule({
  imports: [AppModule,
    BrowserModule.withServerTransition({ appId: 'autodoc-app-ssr' }),
    BrowserTransferStateModule],
  bootstrap: [AppComponent] 
})
export class AppBrowserModule {}