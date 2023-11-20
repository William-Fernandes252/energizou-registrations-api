import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { CreateAdressDto } from 'src/adresses/dto/create-adress.dto';
import { User } from 'src/users/entities/user.entity';

export class CreateCompanyDto extends CreateAdressDto {
  /**
   * Razão social do cliente.
   */
  @IsNotEmpty()
  @IsAlphanumeric()
  reason: string;

  /**
   * CNPJ do cliente (apenas os dígitos).
   */
  @IsNotEmpty()
  @IsNumberString()
  @Length(14, 14)
  cnpj: string;

  /**
   * Telefone do cliente (apenas os dígitos).
   */
  @IsPhoneNumber('BR')
  phone: string;

  /**
   * Representante da empresa (ID de um usúrio registrado e ativo).
   */
  @IsNotEmpty()
  representative: User['id'];
}
