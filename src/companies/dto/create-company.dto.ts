import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CNPJConstraint } from '../validators/constraints';
import { User } from 'src/users/entities/user.entity';
import { AddressAlreadyExistsConstraint } from 'src/addresses/validators/constraints';
import { UserExistsConstraint } from 'src/users/validators/constraints';

export class CreateCompanyDto {
  /**
   * Razão social do cliente.
   */
  @IsNotEmpty({ message: 'O nome da empresa deve ser informado.' })
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
   * Representante da empresa (ID de um usuário registrado e ativo).
   */
  @IsNotEmpty({
    message: 'O ID do representante da empresa deve ser informado.',
  })
  @Validate(UserExistsConstraint)
  representative: User['id'];

  @Validate(AddressAlreadyExistsConstraint, {
    message: 'Já existe um cliente registrado com este endereço.',
  })
  @ValidateNested()
  address: CreateAddressDto;
}
