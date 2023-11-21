import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  jwtSecret: process.env.JWT_SECRET,
}));

export const DEFAULT_SECURITY_SCHEME = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  name: 'JWT',
  description: 'Enter JWT token',
  in: 'header',
  apiName: 'access-token',
};
