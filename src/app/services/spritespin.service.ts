import { Injectable } from '@angular/core';
import 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
declare var jQuery: any;

@Injectable()
export class SpriteSpinService {

    animate(url:string) {
        jQuery('.sprite_place').spritespin({
            source: url,
            width: 480,
            height: 327,
            frames: 24,           
            sense: -1,
            frameTime: 160,
        });
    }
}