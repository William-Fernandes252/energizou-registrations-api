import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserByCredentials(
    email: User['email'],
    password: User['password'],
  ): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await user.checkPassword(password))) {
      return user;
    }
    return null;
  }

  async validateUserById(id: User['id']): Promise<User | null> {
    return await this.usersService.findOne(id);
  }

  async login(user: User) {
    const payload = instanceToPlain(user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
