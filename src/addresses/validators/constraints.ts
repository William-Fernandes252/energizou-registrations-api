import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { AddressesService } from '../addresses.service';
import { CreateAddressDto } from '../dto/create-address.dto';

@Injectable()
@ValidatorConstraint({ name: 'AdressAlreadyExistsConstraint', async: true })
export default class AddressAlreadyExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly addressesService: AddressesService) {}

  async validate(value: CreateAddressDto) {
    const { number, street, cep } = value;
    return (
      (await this.addressesService.findOneBy({ number, street, cep })) === null
    );
  }

  defaultMessage({ value }: Record<'value', CreateAddressDto>) {
    return `O endereço ${value.street}, ${value.number} já existe.`;
  }
}
