import { IsAlpha, IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { Address } from '../entities/address.entity';

export class CreateAddressDto {
  /**
   * Número.
   */
  @IsNotEmpty()
  @IsNumberString()
  number: Address['number'];

  /**
   * Nome da rua.
   */
  @IsNotEmpty()
  @IsAlpha()
  street: Address['street'];

  /**
   * CEP (apenas os dígitos).
   */
  @IsNotEmpty()
  @IsNumberString()
  @Length(8, 8)
  cep: Address['cep'];
}
