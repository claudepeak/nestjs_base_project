//jwt strategy
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../../../modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UserResponseModel } from '../../../modules/auth/model/user-response.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  //new
  async validate(payload: any): Promise<UserResponseModel> {
    const user = await this.authService.validateUserById(payload.sub);
    return user;
  }
}
