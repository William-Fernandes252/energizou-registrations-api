import { IsAlpha, IsNotEmpty, Length } from 'class-validator';

export class CreateAdressDto {
  @Length(3)
  number: string;

  @IsAlpha()
  @IsNotEmpty()
  street: string;
}
