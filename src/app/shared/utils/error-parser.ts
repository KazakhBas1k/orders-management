import { AbstractControl, ValidationErrors } from '@angular/forms';

export function getErrorMessage(control: AbstractControl | null): string | null {
  if (!control || !control.errors || !control.touched) return null;

  const errors: ValidationErrors = control.errors;

  if (errors['required']) {
    return 'Поле обязательно для заполнения';
  }

  if (errors['email']) {
    return 'Введите корректный email';
  }

  if (errors['minlength']) {
    return `Минимальная длина: ${errors['minlength'].requiredLength} символов`;
  }

  if (errors['maxlength']) {
    return `Максимальная длина: ${errors['maxlength'].requiredLength} символов`;
  }

  if (errors['min']) {
    return `Минимальное значение: ${errors['min'].min}`;
  }

  if (errors['max']) {
    return `Максимальное значение: ${errors['max'].max}`;
  }

  return 'Некорректное значение';
}
