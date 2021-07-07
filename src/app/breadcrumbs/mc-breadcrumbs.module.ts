import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { McBreadcrumbsService } from './service/mc-breadcrumbs.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { McBreadcrumbsConfig } from "./service/mc-breadcrumbs.config";

@NgModule({
  imports: [CommonModule, RouterModule],
  
})
export class McBreadcrumbsModule {
  static forRoot() : ModuleWithProviders<McBreadcrumbsModule> {
    return {
      ngModule: McBreadcrumbsModule,
      providers: [
        McBreadcrumbsService,
        McBreadcrumbsConfig
      ]
    };
  }
}
