import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-google-oauth20';

import {Injectable} from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        const callbackURL = process.env.PORT
            ? 'https://example/google/callback'
            : 'http://localhost:3000/auth/google/callback';
        super({
            clientID: '',
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
