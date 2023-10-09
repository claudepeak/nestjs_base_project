import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    const callbackURL = process.env.PORT
      ? 'https://example.com/facebook/callback'
      : 'http://localhost:3000/auth/facebook/callback';
    super({
      clientID: '',
      clientSecret: '',
      callbackURL: callbackURL,
      profileFields: ['id', 'displayName', 'email'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    return profile;
  }
}
