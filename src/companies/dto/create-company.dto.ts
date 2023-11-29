import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  Validate,
} from 'class-validator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CNPJConstraint } from 'src/common/validators/constraints';
import { User } from 'src/users/entities/user.entity';

export class CreateCompanyDto extends CreateAddressDto {
  /**
   * Razão social do cliente.
   */
  @IsNotEmpty({ message: 'O nome da empresa deve ser informado.' })
  @IsAlphanumeric()
  reason: string;

  /**
   * CNPJ do cliente (apenas os dígitos).
   */
  @IsNotEmpty({ message: 'O CNPJ da empresa deve ser informado.' })
  @IsNumberString(
    { no_symbols: true },
    { message: 'O CNPJ deve conter apenas dígitos.' },
  )
  @Validate(CNPJConstraint)
  cnpj: string;

  /**
   * Telefone do cliente (apenas os dígitos).
   */
  @IsPhoneNumber('BR', {
    message: 'O telefone deve conter apenas dígitos.',
  })
  @IsNotEmpty({ message: 'O telefone da empresa deve ser informado.' })
  phone: string;

  /**
   * Representante da empresa (ID de um usúrio registrado e ativo).
   */
  @IsNotEmpty({
    message: 'O ID do representante da empresa deve ser informado.',
  })
  representative: User['id'];
}
