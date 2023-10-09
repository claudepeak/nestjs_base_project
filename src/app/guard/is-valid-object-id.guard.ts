//Is valid object id guard

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { isValidObjectId } from '../common/validator/object-id-validator.util';

@Injectable()
export class IsValidObjectIdGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const id = context.switchToHttp().getRequest().params.id;

    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid id', 400);
    }

    return true;
  }
}
