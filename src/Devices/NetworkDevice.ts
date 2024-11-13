import { DeviceTypes } from "../DeviceTypes";
import { Device } from "./Device";

export abstract class NetworkDevice {
  abstract connectDevice(deviceTypeToAdd: DeviceTypes): boolean;
  ipAddress: string;
  lanIpAddress?: string;
  private portQuantity: number = 4;
  lanPorts: Device[] = [];
  public hasFreeLanPorts(): boolean {
    return this.lanPorts.length < this.portQuantity;
  }
}
