import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'CNPJConstraint', async: false })
export class CNPJConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return cnpj.isValid(value);
  }

  defaultMessage() {
    return 'CNPJ inválido.';
  }
}
