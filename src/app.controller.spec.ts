import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;
  const appService = {
    getRules: vi.fn(),
    addRule: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    appService.getRules.mockResolvedValue([]);
    appService.addRule.mockResolvedValue(undefined);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('index', () => {
    it('returns the rules for the index view', async () => {
      const rules = [{ id: 1, priority: 10, mac: 'AA:BB:CC:11:22:33', enabled: true }];
      appService.getRules.mockResolvedValue(rules);

      await expect(appController.index()).resolves.toEqual({ rules });
      expect(appService.getRules).toHaveBeenCalledOnce();
    });
  });

  describe('addRule', () => {
    it('validates and saves a rule', async () => {
      await appController.addRule({
        priority: '10',
        mac: 'AA:BB:CC:11:22:33',
        enabled: 'on',
      });

      expect(appService.addRule).toHaveBeenCalledWith({
        priority: 10,
        mac: 'AA:BB:CC:11:22:33',
        enabled: true,
      });
    });

    it('rejects priorities that are not 32-bit integers', async () => {
      await expect(
        appController.addRule({
          priority: '2147483648',
          mac: 'AA:BB:CC:11:22:33',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(appService.addRule).not.toHaveBeenCalled();
    });

    it('rejects malformed MAC addresses', async () => {
      await expect(
        appController.addRule({ priority: '10', mac: 'not-a-mac' }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(appService.addRule).not.toHaveBeenCalled();
    });
  });
});
