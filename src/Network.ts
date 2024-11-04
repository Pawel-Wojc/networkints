import { Router } from "./Devices/Router";
import { View } from "./View";
import { NetworkDevice } from "./Devices/NetworkDevice";
export class Network implements InputValidator {
  private validActions = ["1", "2", "9"]; //1 Add device, 2 Show network, 9 Exit
  private validDeviceTypes = ["Router", "Switch", "Pc"];
  private view: View;
  private router: Router = new Router("242.201.2.3");
  private action: number | undefined;
  constructor() {
    this.view = new View(this);
  }

  async runNetwork() {
    var run: boolean = true;
    //creating starting network
    this.router.connectPc();
    this.router.connectSwitch();
    this.router.connectRouter();
    (this.router.lanPorts[1] as NetworkDevice).connectPc();
    (this.router.lanPorts[1] as NetworkDevice).connectPc();
    (this.router.lanPorts[1] as NetworkDevice).connectPc();
    (this.router.lanPorts[1] as NetworkDevice).connectPc();
    (this.router.lanPorts[2] as NetworkDevice).connectPc();
    //end of creating starting network
    this.showNetwork();
    while (run) {
      await this.view.selectAction().then((res) => {
        this.action = parseInt(res);
      });

      switch (this.action) {
        case 1:
          await this.addDevice();
          break;
        case 2:
          this.showNetwork();
          break;
        case 9:
          this.view.showExitMessage();
          run = false;
          break;
        default:
          console.log("Invalid action. Please try again.");
      }
    }
  }

  private async addDevice() {
    let deviceTypeToAdd: string;
    let parent: NetworkDevice;
    await this.view.selectDeviceType().then((res) => {
      //select device type to add
      if (!this.validateIsInputDeviceTypeCorrect(res)) {
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

    if (deviceTypeToAdd == "Router") {
      this.view.deviceConnectionStatus(deviceTypeToAdd, parent.connectRouter());
    }
    if (deviceTypeToAdd == "Switch") {
      this.view.deviceConnectionStatus(deviceTypeToAdd, parent.connectSwitch());
    }
    if (deviceTypeToAdd == "Pc") {
      this.view.deviceConnectionStatus(deviceTypeToAdd, parent.connectPc());
    }
  }
  private showNetwork() {
    this.view.showNetwork(this.router);
  }

  validateIsInputActionCorrect(input: string): boolean {
    return this.validActions.includes(input) ? true : false;
  }

  validateIsInputDeviceTypeCorrect(input: string): boolean {
    return this.validDeviceTypes.includes(input) ? true : false;
  }

  validateIsParentIpCorrect(input: string): boolean {
    return this.router.getParentDevicesIpAddresses().includes(input);
  }
}
