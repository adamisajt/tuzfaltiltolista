import { Injectable } from '@nestjs/common';
import { createPool, RowDataPacket } from 'mysql2/promise';
import { CreateRuleDto } from './create-rule.dto.js';
import { Rule } from './rule.model.js';

@Injectable()
export class AppService {
  private db = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test1',
  });

  async getRules(): Promise<Rule[]> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      'SELECT * FROM blocklist ORDER BY priority ASC, id ASC',
    );

    return rows.map(
      (row) =>
        new Rule(
          row.id,
          row.priority,
          row.mac,
          row.enabled === 1,
        ),
    );
  }

  async addRule(dto: CreateRuleDto): Promise<void> {
    await this.db.execute(
      'INSERT INTO blocklist (priority, mac, enabled) VALUES (?, ?, ?)',
      [dto.priority, dto.mac, dto.enabled ? 1 : 0],
    );
  }
}