import { type ValidationError } from '@nestjs/common';

export default function formatValidationErrors(
  errors: ValidationError[],
  errorMessage?: Record<string, string>,
  nestedField?: string,
) {
  const message = errorMessage || {};
  let errorField = nestedField || '';
  let constraints;
  errors.forEach(error => {
    errorField = nestedField
      ? `${nestedField}.${error.property}`
      : error.property;
    if (!error?.constraints && error?.children?.length) {
      formatValidationErrors(error.children, message, errorField);
    } else {
      constraints = Object.values(error?.constraints);
      if (constraints.length) {
        message[errorField] = constraints[0];
      }
    }
  });
  return message;
}
