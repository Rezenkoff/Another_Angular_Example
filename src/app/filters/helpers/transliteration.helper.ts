//import { SOURCE } from "@angular/core/src/di/injector";

const transliteratedMarker: string = "tltd";

export class TransliterationHelper {  

    private RestoreCase(letter: string, caseState: object): string {
        if (caseState['isUpper']) {
            caseState['isUpper'] = false;
            return letter.toUpperCase();
        }
        return letter;
    }

    private NextCharIsH(sourceString: string, i: number): boolean {
        return ((i + 1 < sourceString.length) &&
            (sourceString[i + 1] == 'h') && //next char is H
            !(i + 2 < sourceString.length && sourceString[i + 2] == 'h'));//no doubled H chars
    }

    public restoreOriginalText(sourceString: string): string {
        if (!sourceString) {
            return "";
        }
        let idx = sourceString.indexOf('-id');
        if (idx > 0) {
            sourceString = sourceString.substring(0, idx);
        }
        if (sourceString.startsWith(transliteratedMarker)) {            
            let char = sourceString[transliteratedMarker.length];
            if (isNaN(Number(char))) {
                return sourceString;
            }
            return this.performPartialTransilteration(sourceString);
        } else {
            return sourceString;
        }        
    }
    //tltd7l2a14l1u32574-emgrand%2520%2528geely%2529-id3332--2000
    public performPartialTransilteration(sourceString: string): string {
        let dashIdx = sourceString.indexOf("-");
        let prefix = sourceString.substring(0, dashIdx);
        sourceString = sourceString.substring(dashIdx + 1, sourceString.length);
        //sourceString = this.restoreSpecSymbols(sourceString);

        let map: boolean[] = [];
        for (let i = 0; i < sourceString.length; i++) {
            map.push(false);
        }

        let endIdx = prefix.indexOf("u");
        if (endIdx < 0) {
            endIdx = prefix.length;
        }
        let encodedTranslitStr = prefix.substring(transliteratedMarker.length, endIdx);
        let pairs: string[] = encodedTranslitStr.split('a');
        let replacePairs = [];
        pairs.forEach(pairStr => {
            let delimiterIdx: number = pairStr.indexOf('l');
            //find start index for translit 
            let startIdx: number = Number(pairStr.substring(0, delimiterIdx));
            //find end index for translit
            let length: number = Number(pairStr.substring(delimiterIdx+1, pairStr.length))
            let endIdx: number = startIdx + length;
            //build map for translit symbols
            for (let i = startIdx; i < endIdx; i++) {
                map[i] = true;
            }            
        })
        let transliterated = this.transliterate(sourceString, map);
        return transliterated;
    }

    public transliterate(sourceString: string, translitedMap: boolean[] = []): string {  
        let result: string = ""
        let i: number = 0;
        let j: number = 0;
        let caseState = { isUpper: false };        
        while (i < sourceString.length) {
            let ch = sourceString[i];

            if (!translitedMap[j]) {
                result += ch;
                i++;
                j++;
                continue;
            }

            if (ch == '%') {
                var encodedeStr = sourceString.substring(i, i+3);
                if (this.latToCyrPairs[encodedeStr]) {
                    result += this.latToCyrPairs[encodedeStr];
                    i += 3;
                    j++;
                    continue;
                }
            }
            //if (ch == 'j' && sourceString[i + 1] == '-') {
            //    i += 2;
            //    caseState.isUpper = true;
            //    continue;
            //}
            if (ch == 'j') //checking for J in prefix
            {
                i++;//go to next symbol
                ch = sourceString[i];
                switch (ch) {
                    case 'e':
                        if (sourceString[i + 1] == 'h') {
                            result += this.RestoreCase('є', caseState);//JEH
                            i++;                            
                        }
                        else {
                            result += this.RestoreCase('ё', caseState);//JE
                        }
                        break;
                    case 's':
                        result += this.RestoreCase('щ', caseState);//JSH
                        i++;
                        break;
                    case 'h':
                        result += this.RestoreCase('ь', caseState);
                        break;
                    case 'u':
                        result += this.RestoreCase('ю', caseState);
                        break;
                    case 'a':
                        result += this.RestoreCase('я', caseState);
                        break;
                    case 'i':
                        result += this.RestoreCase('ї', caseState);
                        break;
                    default:
                        break;
                }
            }
            //checking for H in postfix
            else if (this.NextCharIsH(sourceString, i)) {
                switch (ch) {
                    case 'z':
                        result += this.RestoreCase('ж', caseState);
                        break;
                    case 'k':
                        result += this.RestoreCase('х', caseState);
                        break;
                    case 'c':
                        result += this.RestoreCase('ч', caseState);
                        break;
                    case 's':
                        result += this.RestoreCase('ш', caseState);
                        break;
                    case 'e':
                        result += this.RestoreCase('э', caseState);
                        break;
                    case 'h':
                        result += this.RestoreCase('ъ', caseState);
                        break;
                    case 'i':
                        result += this.RestoreCase('ы', caseState);
                        break;
                    default:
                        break;
                }
                i++; //ignore H postfix
            }
            else //another chars
            {
                var letter = (this.latToCyrPairs[ch.toString()]) ? this.latToCyrPairs[ch.toString()] : ch;
                result += this.RestoreCase(letter, caseState);
            }
            i++; //next char
            j++;
        }
        return result;
    }

    private latToCyrPairs: Object = {
        "%20": ' ',
        "%21": '!',
        "%22": '"',
        "%23": '#',
        "%24": '$',
        "%25": '%',
        "%26": '&',
        "%27": "'",
        "%28": '(',
        "%29": ')',
        "%2a": '*',
        "%2b": '+',
        "%2c": ',',
        "%2e": '.',
        "%2f": '/',
        //WARNING!
        //{'-'  "%2d" } - not encoded because symbol used as delimiter and encoding will break URL parsing logic   
        "j-a": 'А',
        "j-b": 'Б',
        "j-v": 'В',
        "j-g": 'Г',
        "j-d": 'Д',
        "j-e": 'Е',
        "j-je": 'Ё',
        "j-zh": 'Ж',
        "j-z": 'З',
        "j-i": 'И',
        "j-y": 'Й',
        "j-k": 'К',
        "j-l": 'Л',
        "j-m": 'М',
        "j-n": 'Н',
        "j-o": 'О',
        "j-p": 'П',
        "j-r": 'Р',
        "j-s": 'С',
        "j-t": 'Т',
        "j-u": 'У',
        "j-f": 'Ф',
        "j-kh": 'Х',
        "j-c": 'Ц',
        "j-ch": 'Ч',
        "j-sh": 'Ш',
        "j-jsh": 'Щ',
        "j-hh": 'Ъ',
        "j-ih": 'Ы',
        "j-jh": 'Ь',
        "j-eh": 'Э',
        "j-ju": 'Ю',
        "j-ja": 'Я',
        "j-ji": 'Ї',
        "j-jeh": 'Є',
        "a": 'а' ,
        "b": 'б',
        "v": 'в',
        "g": 'г',
        "d": 'д',
        "e": 'е',
        "je": 'ё' ,
        "zh": 'ж' ,
        "z": 'з',
        "i": 'и',
        "y": 'й',
        "k": 'к',
        "l": 'л',
        "m": 'м',
        "n": 'н',
        "o": 'о' ,
        "p": 'п',
        "r": 'р',
        "s": 'с',
        "t": 'т',
        "u": 'у',
        "f": 'ф',
        "kh": 'х',
        "c": 'ц',
        "ch": 'ч',
        "sh": 'ш',
        "jsh": 'щ',
        "hh": 'ъ',
        "ih": 'ы',
        "jh": 'ь',
        "eh": 'э',
        "ju": 'ю',
        "ja": 'я',
        "ji": 'ї',
        "jeh": 'є'
    };
}
