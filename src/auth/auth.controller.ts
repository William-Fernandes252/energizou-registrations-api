import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AllowAny } from './allow-any.decorator';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiSecurity('')
  @AllowAny()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email válido de um usuário ativo.',
        },
        password: { type: 'string', description: 'Senha do usuário.' },
      },
    },
  })
  async login(@Request() req): Promise<{ acess_token: string }> {
    return this.authService.login(req.user);
  }
}
