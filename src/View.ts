import * as readline from "readline";
import { Device } from "./Devices/Device";
import { Router } from "./Devices/Router";
import { Switch } from "./Devices/Switch";
import { Computer } from "./Devices/Computer";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export class View {
  selectDeviceParent(): Promise<string> {
    return new Promise((resolve) => {
      return rl.question(
        "Choose parent router/switch (LAN IP address): ",
        (parent) => {
          if (!this.inputValidator.validateIsParentIpCorrect(parent)) {
            console.log("Invalid parent device. Please try again.");
            resolve(this.selectDeviceParent());
          } else {
            return resolve(parent);
          }
        }
      );
    });
  }
  selectDeviceType(): Promise<string> {
    return new Promise((resolve) => {
      return rl.question(
        "Choose device type (1. Router, 2. Switch, 3. Pc): ",
        (device) => {
          switch (device) {
            case "1":
              device = "Router";
              break;
            case "2":
              device = "Switch";
              break;
            case "3":
              device = "Pc";
              break;
          }

          if (!this.inputValidator.validateIsInputDeviceTypeCorrect(device)) {
            console.log("Invalid device type. Please try again.");
            resolve(this.selectDeviceType());
          } else {
            return resolve(device);
          }
        }
      );
    });
  }
  showExitMessage() {
    console.log("Exiting the Network Simulator...");
    rl.close();
  }
  readline = require("node:readline/promises");
  private inputValidator: InputValidator;
  constructor(inputValidator: InputValidator) {
    this.inputValidator = inputValidator;
    console.log("\x1b[36m%s\x1b[0m", "Welcome to the Network Simulator!");
  }

  selectAction(): Promise<string> {
    return new Promise((resolve) => {
      return rl.question(
        "Select action (1. Add device, 2. Show network, 9. Exit): ",
        (action) => {
          if (!this.inputValidator.validateIsInputActionCorrect(action)) {
            console.log("Invalid action. Please try again.");
            resolve(this.selectAction());
          } else {
            return resolve(action);
          }
        }
      );
    });
  }

  showNetwork(Router: Router) {
    View.printNetwork(Router);
  }

  static printNetwork(device: Device, level: number = 0): void {
    let indent = "    ".repeat(level); // Create indentation based on the level in the hierarchy

    if (device instanceof Router) {
      console.log(`${indent}---- Router (${device.ipAddress}) - WAN`);
      console.log(`${indent}            (${device.lanIpAddress} - LAN`);
      // Recursively print connected devices
      for (let child of device.lanPorts) {
        if (child) {
          View.printNetwork(child, level + 1);
        }
      }
    } else if (device instanceof Switch) {
      console.log(`${indent}---- Switch (${device.ipAddress}) -LAN`);
      // Recursively print connected devices
      for (let child of device.lanPorts) {
        if (child) {
          View.printNetwork(child, level + 1);
        }
      }
    } else if (device instanceof Computer) {
      // Assuming PC has an IP address or some identifier
      console.log(`${indent}---- PC (${device.ipAddress})`);
    }
  }

  deviceConnectionStatus(device: String, status: boolean) {
    if (!status) {
      console.log(`Failed to connect device ${device}.`);
    } else {
      console.log(`Device ${device} connected successfully.`);
    }
  }
}
