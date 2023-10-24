import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './app/services/redis/redis.module';
import { MailModule } from './app/services/mailer/mailer.module';

@Module({
  imports: [RedisModule, MailModule,AuthModule,],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
