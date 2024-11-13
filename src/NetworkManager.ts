import { Router } from "./Devices/Router";
import { View } from "./View";
import { NetworkDevice } from "./Devices/NetworkDevice";
import { DeviceTypes } from "./DeviceTypes";
import { Actions } from "./Actions";
import { InputValidator } from "./InputValidator";
export class NetworkManager implements InputValidator {
  private view: View = new View(this);
  private router: Router = new Router("242.201.2.3");

  async runNetwork() {
    //creating starting network
    this.router.connectDevice(DeviceTypes.PC);
    this.router.connectDevice(DeviceTypes.SWITCH);
    this.router.connectDevice(DeviceTypes.ROUTER);
    (this.router.lanPorts[1] as NetworkDevice).connectDevice(DeviceTypes.PC);
    (this.router.lanPorts[1] as NetworkDevice).connectDevice(DeviceTypes.PC);
    (this.router.lanPorts[1] as NetworkDevice).connectDevice(DeviceTypes.PC);
    (this.router.lanPorts[1] as NetworkDevice).connectDevice(DeviceTypes.PC);
    (this.router.lanPorts[2] as NetworkDevice).connectDevice(DeviceTypes.PC);
    //end of creating starting network

    this.view.showNetwork(this.router);
    var action: Actions;

    while (action !== Actions.EXIT) {
      await this.view.selectAction().then((res) => {
        action = res;
      });

      switch (action) {
        case Actions.ADD_DEVICE:
          await this.addDevice();
          break;
        case Actions.SHOW_NETWORK:
          this.view.showNetwork(this.router);
          break;
        default:
          this.view.showExitMessage();
          break;
      }
    }
  }

  private async addDevice() {
    let deviceTypeToAdd: DeviceTypes;
    let parent: NetworkDevice;
    await this.view.selectDeviceType().then((res) => {
      //select device type to add
      if (!DeviceTypes.isValid(res)) {
        return false;
      }
      deviceTypeToAdd = res;
    });

    await this.view.selectDeviceParent().then((res) => {
      //select device parent
      if (!this.validateIsParentIpCorrect(res)) {
        return false;
      }
      var parents = this.router.getParentDevice();
      parent = parents.find((device) => {
        if (device instanceof Router) {
          //because router has two addresses
          //wan which is dhcp from parent router
          //lan which is for connecting another devices
          return device.lanIpAddress === res;
        } else {
          return device.ipAddress === res;
        }
      });
    });

    this.view.deviceConnectionStatus(
      deviceTypeToAdd,
      parent.connectDevice(deviceTypeToAdd)
    );
  }

  validateIsParentIpCorrect(input: string): boolean {
    return this.router.getParentDevicesIpAddresses().includes(input);
  }
}
