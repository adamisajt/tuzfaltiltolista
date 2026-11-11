export class Rule {
  id: number;
  priority: number;
  mac: string;
  enabled: boolean;

  constructor(
    id: number,
    priority: number,
    mac: string,
    enabled: boolean,
  ) {
    this.id = id;
    this.priority = priority;
    this.mac = mac;
    this.enabled = enabled;
  }
}