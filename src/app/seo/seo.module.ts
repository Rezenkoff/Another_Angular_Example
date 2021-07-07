import { NgModule, ModuleWithProviders } from '@angular/core';
import { GtagCommonEventsHandlerService } from './services/gtag-common-events-handler.service';
import { GtagSenderService } from './services/gtag-sender.service';

@NgModule({
    //imports: [RouterModule],
    providers: [GtagCommonEventsHandlerService],
    //exports: [RouterModule]
})

export class SeoModule  {
    static forRoot(): ModuleWithProviders<SeoModule> {
        return {
            ngModule: SeoModule,
            providers: [GtagCommonEventsHandlerService, GtagSenderService]
        } 
    }
}