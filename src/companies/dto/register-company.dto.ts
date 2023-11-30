import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateCompanyDto } from './create-company.dto';
import { ValidateNested } from 'class-validator';

class CreateRepresentativeDto extends OmitType(CreateUserDto, [
  'isAdmin',
] as const) {}

export class RegisterCompanyDto extends OmitType(CreateCompanyDto, [
  'representative',
] as const) {
  @ValidateNested()
  representative: CreateRepresentativeDto;
}
