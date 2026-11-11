import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { CreateRuleDto } from './create-rule.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const rules = await this.appService.getRules();

    return { rules };
  }

  @Post('rules')
  @Redirect('/')
  async addRule(
    @Body()
    body: {
      priority?: string;
      mac?: string;
      enabled?: string;
    },
  ) {
    const priorityText = String(body.priority ?? '').trim();
    const priority = Number(priorityText);
    const mac = String(body.mac ?? '').trim();
    const enabled = body.enabled === 'on';

    if (
      !/^-?\d+$/.test(priorityText) ||
      !Number.isInteger(priority) ||
      priority < -2147483648 ||
      priority > 2147483647
    ) {
      throw new BadRequestException('A prioritás egész szám legyen!');
    }

    const macPattern = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/;

    if (!macPattern.test(mac)) {
      throw new BadRequestException(
        'Hibás MAC-cím! Példa: AA:BB:CC:11:22:33',
      );
    }

    const dto = new CreateRuleDto(priority, mac, enabled);

    await this.appService.addRule(dto);
  }
}