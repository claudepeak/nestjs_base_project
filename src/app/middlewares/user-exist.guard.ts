import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminOnly implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get user from the headers
    const user = context.switchToHttp().getRequest().user;

    if (user.isAdmin === false || user.isAdmin === undefined) {
      throw new ConflictException('Admin only');
    }

    return user.isAdmin;
  }
}
