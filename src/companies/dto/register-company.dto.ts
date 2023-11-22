import { IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateCompanyDto } from './create-company.dto';

export class RegisterCompanyDto extends IntersectionType(
  OmitType(CreateCompanyDto, ['representative'] as const),
  OmitType(CreateUserDto, ['isAdmin'] as const),
  CreateAddressDto,
) {}
