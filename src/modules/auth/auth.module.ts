import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../../app/common/strategy/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RedisService } from 'src/app/services/redis/redis.service';
import { MailService } from 'src/app/services/mailer/mail.service';

import { LocalStrategy } from 'src/app/common/strategy/local.strategy';
import { FacebookStrategy } from '../../app/strategies/facebook.strategy';
import { GoogleStrategy } from '../../app/strategies/google.strategy';
import * as admin from 'firebase-admin';

const serviceAccount = 'fb-json.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    RedisService,
    MailService,
    JwtStrategy,
    LocalStrategy,
    PrismaService,
    JwtService,
    ConfigService,
    GoogleStrategy,
    FacebookStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
})
export class AuthModule {}
