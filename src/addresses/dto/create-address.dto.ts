import { IsNotEmpty, IsNumberString, Length, Matches } from 'class-validator';
import { Address } from '../entities/address.entity';

export class CreateAddressDto {
  /**
   * Número.
   */
  @IsNotEmpty({ message: 'O número deve ser informado.' })
  @IsNumberString()
  number: Address['number'];

  /**
   * Nome da rua.
   */
  @IsNotEmpty({ message: 'O nome da rua deve ser informado.' })
  @Matches(/^[\wçÇ][\w\sçÇ]*[\wçÇ]$/, {
    message: 'O nome da rua deve conter apenas letras e espaços.',
  })
  street: Address['street'];

  /**
   * CEP (apenas os dígitos).
   */
  @IsNotEmpty({ message: 'O CEP deve ser informado.' })
  @IsNumberString(
    { no_symbols: true },
    { message: 'O CEP deve conter apenas dígitos.' },
  )
  @Length(8, 8, { message: 'CEP inválido.' })
  cep: Address['cep'];
}
