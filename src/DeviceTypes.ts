export enum DeviceTypes {
  PC = "Pc",
  SWITCH = "Switch",
  ROUTER = "Router",
}
export namespace DeviceTypes {
  export function parse(input: string): DeviceTypes | null {
    if (Object.values(DeviceTypes).includes(input as DeviceTypes)) {
      return input as DeviceTypes;
    }
    return null; // Return null if the input doesn't match any enum value
  }
  export function isValid(input: DeviceTypes): boolean {
    return Object.values(DeviceTypes).includes(input);
  }
}
