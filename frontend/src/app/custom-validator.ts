import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})


export class CustomValidator {
    patternValidator(): ValidatorFn {
      return (control:AbstractControl) : {[key:string]:any} => {
        if(!control.value) {
          return null;
        }
        const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&].{7,}$');
        const valid = regex.test(control.value);
        return valid?null: {invalidPassword:true};
      };
    }
}