import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserByIdPipe {
  constructor(private readonly usersService: UsersService) {}

  async transform(id: User['id']) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
