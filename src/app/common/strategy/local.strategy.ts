//local strategy
import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local'; //new

import {User} from '@prisma/client'; //new
import {AuthService} from 'src/modules/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            isAdminField: 'isAdmin',
            sessionIdField: 'sessionId',
        });
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.authService.validatePassword(email, password);
        return user;
    }

}
