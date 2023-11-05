import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: User['email'],
    password: User['password'],
  ): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await user.checkPassword(password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      ...user,
      isAdmin: undefined,
      sub: user.id,
    };
    return {
      acess_token: this.jwtService.sign(payload),
    };
  }
}
