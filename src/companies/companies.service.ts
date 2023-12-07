import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { AddressesService } from 'src/addresses/addresses.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly usersService: UsersService,
    private readonly addressesService: AddressesService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const user = await this.usersService.findOne(
      createCompanyDto.representative,
    );
    if (!user) {
      return Promise.reject('User not found');
    }

    const address = await this.addressesService.create(
      createCompanyDto.address,
    );

    const newCompany = new Company();
    Object.assign(newCompany, {
      ...createCompanyDto,
      representative: user,
      users: [user],
      address: address,
    });

    return await this.companyRepository.save(newCompany);
  }

  async findAll(
    options: IPaginationOptions &
      PageOptionsDto<Pick<Company, 'reason' | 'created'>>,
  ): Promise<Pagination<Company>> {
    const queryBuilder = this.companyRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.address', 'address')
      .leftJoinAndSelect('c.representative', 'representative');
    if (options.sort) {
      queryBuilder.orderBy('c.' + options.sort, options.order);
    }
    return await paginate<Company>(queryBuilder, options);
  }

  async findOneByCNPJ(cnpj: Company['cnpj']): Promise<Company | null> {
    return await this.companyRepository.findOneBy({ cnpj });
  }

  async findOne(id: Company['id']): Promise<Company | null> {
    return await this.companyRepository.findOneBy({ id });
  }

  async update(
    id: Company['id'],
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const existingCompany = await this.companyRepository.findOneBy({ id });
    if (!existingCompany) {
      return null;
    }

    if (updateCompanyDto.representative) {
      const user = await this.usersService.findOne(
        updateCompanyDto.representative,
      );
      if (!user) {
        return Promise.reject('User not found');
      }
      existingCompany.users = existingCompany.users.filter(
        user => user.id !== updateCompanyDto.representative,
      );
      existingCompany.representative = user;
    }

    if (updateCompanyDto.address) {
      await this.addressesService.update(existingCompany.address.id, {
        number: existingCompany.address.number,
        street: existingCompany.address.street,
      });
    }
    return await this.companyRepository.save(existingCompany);
  }

  async remove(id: Company['id']): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      return null;
    }
    return await this.companyRepository.remove(company);
  }

  async register(registrationData: RegisterCompanyDto): Promise<Company> {
    const user = await this.usersService.getOrCreate({
      ...registrationData.representative,
      isAdmin: false,
    });
    return await this.create({
      reason: registrationData.reason,
      cnpj: registrationData.cnpj,
      representative: user.id,
      phone: registrationData.phone,
      address: registrationData.address,
    });
  }
}
