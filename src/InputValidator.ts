interface InputValidator {
  validateIsInputActionCorrect(input: string): boolean;
  validateIsInputDeviceTypeCorrect(input: string): boolean;
  validateIsParentIpCorrect(input: string): boolean;
}
