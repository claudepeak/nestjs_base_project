import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class UserExistGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get user from multipart form
    const user = context.switchToHttp().getRequest();

    const userExist = await this.authService.findUserByEmail(user.email);

    if (userExist) throw new ConflictException('User already exist');
    // "!!"" converts the value to a boolean
    return !!!userExist; //true
  }
}
