import { Injectable } from '@angular/core';

@Injectable()
export class CdnImageHelper {

    public getImage(productId: number):string {
        let id_str = productId.toString().replace("-", "_");
        return "https://ico2.autodoc.ua/" + id_str + "_1.jpg";
    }

}
