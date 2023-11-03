import { IsAlphanumeric, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Adress } from 'src/adresses/entities/adress.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  name: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  cnpj: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsNotEmpty()
  representative: User['id'];

  @IsNotEmpty()
  number: Adress['number'];

  @IsNotEmpty()
  street: Adress['street'];
}
