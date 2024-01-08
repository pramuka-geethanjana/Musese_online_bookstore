import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn
} from '@angular/forms';

var regex = '/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$| (?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]? [0-9]+[- ]?[0-9]+[- ]?[0-9X]$/';

function isValidISBN(isbn) {

  // length must be 10
  let n = isbn.length;
  if (n != 10)
    return false;

  // Computing weighted sum of
  // first 9 digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = isbn[i] - 0;

    if (0 > digit || 9 < digit)
      return false;

    sum += (digit * (10 - i));
  }

  // Checking last digit.
  let last = isbn[9];
  if (last != 'X' && (last < '0' || last > '9'))
    return false;

  // If last digit is 'X', add 10
  // to sum, else add its value.
  sum += ((last == 'X') ? 10 : (last - 0));

  // Return true if weighted sum
  // of digits is divisible by 11.
  return (sum % 11 == 0);
}

export const isIsbnValidator = (isbnControlName: any): any => {
  const isControlIsbn = isValidISBN(isbnControlName)
  console.log('isControlIsbn', isControlIsbn)
  return isControlIsbn;
};

export const IsIsbnValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const isControlIsbn = isValidISBN(control.value);
  console.log('IsIsbnValidator 2', isControlIsbn);
  return !isControlIsbn ? { 'isbn': false } : null;
};

@Directive({
  selector: '[appIsIsbn]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: IsIsbnDirective,
    multi: true
  }]
})
export class IsIsbnDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    return IsIsbnValidator(control);
  }

}

