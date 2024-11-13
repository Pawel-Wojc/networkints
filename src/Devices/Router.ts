import { Computer } from "./Computer";
import { Device } from "./Device";
import { Switch } from "./Switch";
import { NetworkDevice } from "./NetworkDevice";
import { DeviceTypes } from "../DeviceTypes";

export class Router extends NetworkDevice implements Device {
  private ipReleases: string[] | undefined;

  constructor(ipAddress: string) {
    super();
    this.lanIpAddress = this.getNewIpAddress();
    this.ipAddress = ipAddress;
  }

  getParentDevicesIpAddresses(): string[] {
    var parentDevices: Device[] = this.searchFreeParentDevices(this);
    var result: string[] = [];
    parentDevices.forEach((element) => {
      if (element instanceof Router) {
        result.push(element.lanIpAddress);
      } else if (element instanceof Switch) {
        result.push(element.ipAddress);
      }
    });
    return result;
  }

  getParentDevice(): NetworkDevice[] {
    return this.searchFreeParentDevices(this);
  }

  connectDevice(deviceTypeToAdd: DeviceTypes): boolean {
    if (super.hasFreeLanPorts()) {
      switch (deviceTypeToAdd) {
        case DeviceTypes.PC:
          this.lanPorts.push(new Computer(this.getNewIpAddress(), this));
          break;
        case DeviceTypes.SWITCH:
          this.lanPorts.push(new Switch(this.getNewIpAddress(), this));
          break;
        case DeviceTypes.ROUTER:
          this.lanPorts.push(new Router(this.getNewIpAddress()));
          break;
        default:
          return false;
      }
      return true;
    }
    return false;
  }

  getNewIpAddress(): string {
    if (this.ipReleases) {
      //if releases are not empty
      let octets = this.ipReleases[this.ipReleases.length - 1].split("."); //take the last IP address
      let newAddress = `${octets[0]}.${octets[1]}.${octets[2]}.${
        parseInt(octets[3]) + 1
      }`;
      this.ipReleases.push(newAddress);
      return newAddress;
    }
    const octet1 = Math.floor(Math.random() * 256);
    const octet2 = Math.floor(Math.random() * 256);
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 256);
    let newAddress = `${octet1}.${octet2}.${octet3}.${octet4}`;
    this.ipReleases = [];
    this.ipReleases.push(newAddress);
    return newAddress;
  }

  private searchFreeParentDevices(device: Device): NetworkDevice[] {
    ///searching throught whole network to find free LAN ports
    let result: NetworkDevice[] = [];

    // Helper function to recursively check for free LAN ports
    function search(device: Device) {
      if (device instanceof Switch) {
        // Check if any port is free
        if (device.hasFreeLanPorts()) {
          result.push(device);
        }

        // Recursively search through connected devices (children)
        for (let child of device.lanPorts) {
          if (child) {
            search(child);
          }
        }
      } else if (device instanceof Router) {
        // Check if device have at least one free port, if yes, it can be parrent
        if (device.hasFreeLanPorts()) {
          result.push(device);
        }

        // Recursively search through connected devices (children)
        for (let child of device.lanPorts) {
          if (child) {
            search(child);
          }
        }
      }
      // PCs are end devices, so no need to search further
    }

    search(device);
    return result;
  }
}
