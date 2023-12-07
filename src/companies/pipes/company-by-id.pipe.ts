import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesService } from '../companies.service';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyByIdPipe {
  constructor(private readonly companiesService: CompaniesService) {}

  async transform(id: Company['id']) {
    const company = await this.companiesService.findOne(id);
    if (!company) {
      throw new NotFoundException();
    }
    return company;
  }
}
