import { DeviceTypes } from "../DeviceTypes";
import { Computer } from "./Computer";
import { Device } from "./Device";
import { NetworkDevice } from "./NetworkDevice";
import { Router } from "./Router";

export class Switch extends NetworkDevice implements Device {
  private parentDevice: NetworkDevice;

  constructor(ipAddress: string, device: NetworkDevice) {
    super();
    this.parentDevice = device;
    this.ipAddress = ipAddress;
  }

  connectDevice(deviceTypeToAdd: DeviceTypes): boolean {
    if (super.hasFreeLanPorts()) {
      let parent = this.getParentRouter();
      switch (deviceTypeToAdd) {
        case DeviceTypes.PC:
          this.lanPorts.push(new Computer(parent.getNewIpAddress(), this));
          break;
        case DeviceTypes.SWITCH:
          this.lanPorts.push(new Switch(parent.getNewIpAddress(), this));
          break;
        case DeviceTypes.ROUTER:
          this.lanPorts.push(new Router(parent.getNewIpAddress()));
          break;
        default:
          return false;
      }
      return true;
    }
    return false;
  }

  getParentRouter(): Router {
    //searching to reach first parent in the tree
    if (this.parentDevice instanceof Router) {
      return this.parentDevice as Router;
    } else {
      if (this.parentDevice instanceof Switch) {
        return this.parentDevice.getParentRouter();
      }
    }
  }
}
