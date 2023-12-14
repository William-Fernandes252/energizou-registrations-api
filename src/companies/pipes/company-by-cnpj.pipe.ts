import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesService } from '../companies.service';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyByCnpjPipe {
  constructor(private readonly companiesService: CompaniesService) {}

  async transform(cnpj: Company['cnpj']) {
    const company = await this.companiesService.findOneByCNPJ(cnpj);
    if (!company) {
      throw new NotFoundException();
    }
    return company;
  }
}
