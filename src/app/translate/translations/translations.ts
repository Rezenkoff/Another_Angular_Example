import { InjectionToken  } from '@angular/core';

import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_RU_NAME, LANG_RU_TRANS } from './lang-ru';
import { LANG_UKR_NAME, LANG_UKR_TRANS } from './lang-ukr';

export const TRANSLATIONS = new InjectionToken('translations');

const dictionary = {
    "EN": LANG_EN_TRANS,
    "RU": LANG_RU_TRANS,
    "UKR": LANG_UKR_TRANS,
};

export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];