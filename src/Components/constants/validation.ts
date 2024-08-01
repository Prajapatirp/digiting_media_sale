export const validationMessages = {
  required: (fieldName: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } is required`,
  format: (fieldName: string) => ` ${fieldName} should be in correct format.`,
  passwordLength: (fieldName: string, minLength: number) =>
    `${fieldName} must be at least ${minLength} characters`,
  passwordComplexity: (fieldName: string) =>
    `${fieldName} must contain at least one uppercase letter, one lowercase letter, one number, and one special character`,
  passwordsMatch: (fieldName: string) => `${fieldName} must match`,
  phoneNumber: (fieldName: string) =>
    `Invalid ${fieldName.toLowerCase()} format`,
  notSameAsField: (fieldName: string, comparedField: string) =>
    `${fieldName} must be different from ${comparedField}`,
  maxLength: (fieldName: string, maxLength: number) =>
    `${fieldName} must be at most ${maxLength} characters`,
  positiveNumber: (fieldName: string) =>
    `${fieldName} must be positive`,
};

export const  textRegex = /^[A-Za-z\s]+$/;

export const InputPlaceHolder = (fieldName: string) => {
  return `Enter ${fieldName.toLowerCase()}`;
};

export const SelectPlaceHolder = (fieldName: string) => {
  return `Select ${fieldName.toLowerCase()}`;
};
