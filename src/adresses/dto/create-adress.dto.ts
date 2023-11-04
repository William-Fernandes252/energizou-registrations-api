import { IsAlpha, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class CreateAdressDto {
  @Length(3)
  @IsNumberString()
  number: string;

  @IsAlpha()
  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  @IsNumberString()
  cep: string;
}
