import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  /**
   * Email do usuário.
   */
  @IsEmail()
  email: string;

  /**
   * Senha do usuário. Deve ter pelo menos uma letra minúscula, uma maiúscula, um
   * número, um caractere especial e no mínimo 8 caracteres.
   */
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  password: string;

  /**
   * Nome completo do usuário.
   */
  @IsNotEmpty()
  name: string;

  isAdmin?: boolean = false;
}
