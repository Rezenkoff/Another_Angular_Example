import { NgModule } from '@angular/core';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/modules/shared.module';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};


@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,
        AuthRoutingModule, 
        FormsModule,
        NgxMaskModule.forRoot(options)
    ],
    declarations: [
        AuthComponent, 
        LoginComponent, 
        RegistrationComponent, 
        ForgotPasswordComponent, 
        ResetPasswordComponent
    ],
    
})
export class AuthModule {
   
}

