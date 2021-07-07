interface Scripts {
    name: string;
    src: string;
}
export const ScriptStore: Scripts[] = [   
    { name: 'spritespin', src: 'https://cdnjs.cloudflare.com/ajax/libs/spritespin/3.4.3/spritespin.min.js' },
    { name: 'ckeditor', src: 'https://cdn.ckeditor.com/4.7.3/full/ckeditor.js' },
    { name: 'liqpay_checkout', src: 'https://static.liqpay.ua/libjs/checkout.js' },
    { name: 'crm-bitrix', src: '../../js/crm-bitrix.js' },
    { name: 'facebook-pixel', src: '../../js/facebook-pixel.js' },
    { name: 'google-tag-manager', src: '../../js/gtm.js' },
];      