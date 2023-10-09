import { Test, TestingModule } from '@nestjs/testing';
import { DeeplinkController } from './deeplink.controller';
import { DeeplinkService } from './deeplink.service';

describe('DeeplinkController', () => {
  let controller: DeeplinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeeplinkController],
      providers: [DeeplinkService],
    }).compile();

    controller = module.get<DeeplinkController>(DeeplinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
