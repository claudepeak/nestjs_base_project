import { Module } from '@nestjs/common';
import { DeeplinkService } from './deeplink.service';
import { DeeplinkController } from './deeplink.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [DeeplinkController],
  providers: [DeeplinkService],
  exports: [DeeplinkService],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class DeeplinkModule {}
