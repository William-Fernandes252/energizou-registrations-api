import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  /**
   * Email do usuário.
   */
  @IsEmail(undefined, { message: 'Email inválido.' })
  @IsNotEmpty({ message: 'O email deve ser informado.' })
  email: string;

  /**
   * Senha do usuário. Deve ter pelo menos uma letra minúscula, uma maiúscula, um
   * número, um caractere especial e no mínimo 8 caracteres.
   */
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve ter pelo menos uma letra minúscula, uma maiúscula, um número, um caractere especial, no mínimo 8 caracteres e no máximo 128.',
    },
  )
  @IsNotEmpty({ message: 'A senha deve ser informada.' })
  password: string;

  /**
   * Nome completo do usuário.
   */
  @IsNotEmpty({ message: 'O nome deve ser informado.' })
  name: string;

  isAdmin?: boolean = false;
}
