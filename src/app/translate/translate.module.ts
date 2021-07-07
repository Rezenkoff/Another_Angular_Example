import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangComponent } from './components/language.component/language.component';
import { TRANSLATION_PROVIDERS, TranslatePipe } from './translations';

@NgModule({
    imports: [CommonModule],
    declarations: [LangComponent, TranslatePipe],
    exports: [LangComponent, TranslatePipe],
    providers: [TRANSLATION_PROVIDERS]
})
export class TranslateModule {}