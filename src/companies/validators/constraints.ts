import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj } from 'cpf-cnpj-validator';
import { CompaniesService } from '../companies.service';
import { Company } from '../entities/company.entity';

@ValidatorConstraint({ name: 'CNPJConstraint', async: false })
export class CNPJConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return cnpj.isValid(value);
  }

  defaultMessage() {
    return 'CNPJ inválido.';
  }
}

@Injectable()
@ValidatorConstraint({
  name: 'CompanyWithCNPJAlreadyExistsConstraint',
  async: true,
})
export class CompanyWithCNPJAlreadyExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly companiesService: CompaniesService) {}

  async validate(value: Company['cnpj']) {
    return (await this.companiesService.findOneByCNPJ(value)) === null;
  }

  defaultMessage() {
    return `Já existe uma empresa cadastrada com este CNPJ.`;
  }
}
