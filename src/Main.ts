import { NetworkManager } from "./NetworkManager";
class Main {
  static main(): void {
    const networkManager = new NetworkManager();
    networkManager.runNetwork();
  }
}
Main.main();
