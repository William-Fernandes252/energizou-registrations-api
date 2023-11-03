import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { beforeEach, it, expect, describe } from 'vitest';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
