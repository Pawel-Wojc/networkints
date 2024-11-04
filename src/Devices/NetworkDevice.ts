export interface NetworkDevice {
  ipAddress: string;
  lanIpAddress?: string;
  connectPc(): boolean;
  connectSwitch(): boolean;
  connectRouter(): boolean;
}
