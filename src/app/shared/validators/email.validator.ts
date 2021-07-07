import { FormControl} from  '@angular/forms'; 

export class CustomValidators {

    static emailValidator(control: FormControl) {
        if (control.value != null && control.value != '') {
            if (!control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {

                return { 'invalidEmailAddress': true };
            }
        }
    }

    static phoneValidator(control: FormControl) {
        return (control.value && control.value.match('[0-9]{10}')) ? null : { 'invalidPhone': true};
    }

    static phoneStartsWithPlusValidator(control: FormControl) {
        return (control.value && control.value.match(/^\+([0-9]{12})$/)) ? null : { 'invalidPhone': true };
    }
}
