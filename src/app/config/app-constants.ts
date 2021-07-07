import { InjectionToken } from "@angular/core";

export let APP_CONSTANTS = new InjectionToken("APP.CONSTANTS");

export interface IAppConstants {
    STYLING: any;
    PATTERNS: any;
    ROLES: any;
    AUTH: any;
    G_MAPS: any;
    CACHE: any;
    IMAGES: any;
    SEARCH: { URL: string, SORT_OPTIONS: any };
    PRODUCT: any;
    ALERT: any;
    FILE: any;
    GTAG_AD_WORDS_KEY: any;
    GTAG_ANALYTICS_KEY: any;
}

export const app_constants: IAppConstants = {
    STYLING: {
        DISPLAY_NONE: "none",
        DISPLAY_BLOCK: "block",
        ACTIVE_CLASS: "active",
        ACTIVE_LINK_CLASS: "active active-link",
        DISPLAY_INLINE_BLOCK: "inline-block",
        COMMENT_HEIGHT_O: "0px",
        COMMENT_HEIGHT_DISPLAY: "150px",
        DISABLE_COLOR: "#9c9c9c",
        ENABLE_COLOR: "#86c934"
    },
    PATTERNS: {
        PHONE_MASK: ['+', '3', '8', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        PHONE_PATTERN: '[0-9]{10}',
        CALLBACK_PATTERN: '[+][0-9]{12}',
        PASSWORD_PATTERN: '[a-zA-Z0-9!@$?_=&^-]{5,}',
        VIN_LENGTH: '[a-zA-Z0-9]{17}',
        VIN_REGEX: '[A-HJ-NOPR-Z0-9]{17}',
        EMAIL_PATTERN: '[a-zA-Z0-9._%+-]{1,}[@][a-zA-Z0-9.-]{2,}[.][a-zA-Z]{2,}',
        FULLNAME_PATTERN: "[a-zA-Zа-яёїА-ЯЁЇ '-]{1,50}"
    },
    ROLES: {
        ADMIN: "Admin",
        USER: "User",
        MANAGER: "Manager"
    },
    AUTH: {
        LOGIN_PATH: "account/login",
        ACCOUNT_CREATE_PATH: "account/create",
        ACCOUNT_DATA_PATH: "account/data",
        FORGOT_PASSWORD: "account/password/forgot",
        RESET_PASSWORD: "account/password/reset",
        ERRORS: {
            "invalid_username_or_password": "Неверное имя или пароль",
            "user_not_found": "Пользователь не найден",
            "email_not_available": "Такой e-mail уже существует",
            "change_email_fail": "Ошибка изменения E-mail",
            "user_update_fail": "Ошибка изменения имени",
            "default": "Ошибка авторизации",
            "DuplicateUserName": "Пользователь с таким именем уже зарегистрирован",
            "DuplicateEmail": "Пользователь с таким e-mail уже зарегистрирован",
            "InvalidEmail": "Некорректный e-mail",
            "sms_count_over": "Вы использовали все SMS. Попробуйте позже !",
            "unknown_error": "Произошла ошибка. Попробуйте позже !"
        }
    },
    G_MAPS: {
        DEFAULT_LAT: 50.457300,
        DEFAULT_LONG: 30.502416,
        DEFAULT_ZOOM: 6,
        AUTODOC_MARKERS: 'https://cdn.autodoc.ua/',
        MARKERS_LOAD_PATH: '/googlemaps/markers',
        STO_MARKERS_LOAD_PATH: '/googlemaps/sto/markers'
    },
    CACHE: {
        SIZE: 500,
        MAX_AGE: 10000 * 60 * 60
    },  
    IMAGES: {
        VIN_MODEL: 'https://cdn.autodoc.ua/images/marks/',
        VIN_MODEL_CABINET: 'https://cdn.autodoc.ua/images/marks/',
        NO_IMAGE_URL: 'https://cdn.autodoc.ua/images/no_image.png'
    },
    SEARCH: {
        URL: 'search/product',
        SORT_OPTIONS: {
            byDefault: '',
            byName: 'DisplayDescription',
            byBrand: 'BrandDesc.raw',
            byPrice: 'Price'
        }
    },
    PRODUCT: {
        GETDETAILBYID: 'product/article/detail',
        GETANALOGS: 'product/analog',
        GETPRODUCT: 'product/get'
    },
    ALERT: {
        LIFETIME: 7000,
        SHORTLIFETIME: 2000,
        LONGLIFETIME: 6000
    },
    FILE: {
        MAX_SIZE: 18600000
    },
    GTAG_AD_WORDS_KEY: "AW-801184892",
    GTAG_ANALYTICS_KEY: "UA-107152467-1"   
};
