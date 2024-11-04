import { Device } from "./Device";

export class Computer implements Device {
  ipAddress: string;
  parentDevice: Device;
  /**
   *
   */
  constructor(ipAddress: string, device: Device) {
    this.parentDevice = device;
    this.ipAddress = ipAddress;
  }
}
