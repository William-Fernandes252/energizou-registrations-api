import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  jwtSecret: process.env.JWT_SECRET,
}));
