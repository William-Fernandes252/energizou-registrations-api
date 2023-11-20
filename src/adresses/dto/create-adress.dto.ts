import { IsAlpha, IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { Adress } from '../entities/adress.entity';

export class CreateAdressDto {
  /**
   * Número.
   */
  @IsNotEmpty()
  @IsNumberString()
  number: Adress['number'];

  /**
   * Nome da rua.
   */
  @IsNotEmpty()
  @IsAlpha()
  street: Adress['street'];

  /**
   * CEP (apenas os digitos).
   */
  @IsNotEmpty()
  @IsNumberString()
  @Length(8, 8)
  cep: Adress['cep'];
}
