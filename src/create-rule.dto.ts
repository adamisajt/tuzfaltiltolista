export class CreateRuleDto {
  priority: number;
  mac: string;
  enabled: boolean;

  constructor(priority: number, mac: string, enabled: boolean) {
    this.priority = priority;
    this.mac = mac;
    this.enabled = enabled;
  }
}