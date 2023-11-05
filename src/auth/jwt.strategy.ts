import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret'),
      userNameField: 'email',
    });
  }

  async validate(payload: any): Promise<Omit<User, 'password' | 'isAdmin'>> {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      company: payload.company,
    } as User;
  }
}
