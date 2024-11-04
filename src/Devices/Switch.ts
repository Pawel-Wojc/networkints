import { Computer } from "./Computer";
import { Device } from "./Device";
import { NetworkDevice } from "./NetworkDevice";
import { Router } from "./Router";

export class Switch implements Device, NetworkDevice {
  private parentDevice: NetworkDevice;
  ipAddress: string;
  lanPorts: Device[] = [];
  constructor(ipAddress: string, device: NetworkDevice) {
    this.parentDevice = device;
    this.ipAddress = ipAddress;
  }

  hasFreeLanPorts(): boolean {
    if (this.lanPorts.length < 4) {
      return true;
    }
    return false;
  }
  connectRouter(): boolean {
    if (this.hasFreeLanPorts()) {
      let parent = this.getParentRouter();
      this.lanPorts.push(new Router(parent.getNewIpAddress()));
      return true;
    }
    return false;
  }
  connectSwitch(): boolean {
    if (this.hasFreeLanPorts()) {
      let parent = this.getParentRouter();
      this.lanPorts.push(new Switch(parent.getNewIpAddress(), this));
      return true;
    }
    return false;
  }
  connectPc(): boolean {
    if (this.hasFreeLanPorts()) {
      let parent = this.getParentRouter();
      this.lanPorts.push(new Computer(parent.getNewIpAddress(), this));
      return true;
    }
    return false;
  }

  getParentRouter(): Router {
    //searching to reach first parent in the tree
    if (this.parentDevice instanceof Router) {
      return this.parentDevice as Router;
    } else {
      return this.getParentRouter();
    }
  }
}
