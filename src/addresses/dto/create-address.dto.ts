import { IsNotEmpty, IsNumberString, Length, Matches } from 'class-validator';
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
  @Matches(/^[\wçÇ][\w\sçÇ]*[\wçÇ]$/, {
    message: 'street must contain only letters and spaces',
  })
  street: Address['street'];

  /**
   * CEP (apenas os dígitos).
   */
  @IsNotEmpty()
  @IsNumberString()
  @Length(8, 8)
  cep: Address['cep'];
}
