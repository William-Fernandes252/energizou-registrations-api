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
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { AddUserDto } from './dto/add-user.dto';
import type { Sorting } from 'src/common/decorators/sorting-params.decorator';
import type { User } from 'src/users/entities/user.entity';

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
    pagination: IPaginationOptions & PageOptionsDto,
    sorting?: Sorting,
    search?: string,
  ): Promise<Pagination<Company>> {
    const queryBuilder = this.companyRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.address', 'a')
      .leftJoinAndSelect('c.representative', 'r');

    if (search) {
      queryBuilder
        .where('c.reason LIKE :search', { search: `%${search}%` })
        .orWhere('c.cnpj LIKE :search', { search: `%${search}%` })
        .orWhere('r.name LIKE :search', { search: `%${search}%` });
    }

    if (sorting && sorting.property) {
      queryBuilder.orderBy('c.' + sorting.property, sorting.direction);
    }

    return await paginate<Company>(queryBuilder, pagination);
  }

  async findOneByCNPJ(cnpj: Company['cnpj']): Promise<Company | null> {
    return await this.companyRepository.findOneBy({ cnpj });
  }

  async findOne(id: Company['id']): Promise<Company | null> {
    return await this.companyRepository.findOneBy({ id });
  }

  async update(
    company: Company,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    if (updateCompanyDto.representative) {
      const user = await this.usersService.findOne(
        updateCompanyDto.representative,
      );
      if (!user) {
        return Promise.reject('User not found');
      }
      company.users = company.users.filter(
        user => user.id !== updateCompanyDto.representative,
      );
      company.representative = user;
    }

    if (updateCompanyDto.address) {
      await this.addressesService.update(company.address.id, {
        number: company.address.number,
        street: company.address.street,
      });
    }
    return await this.companyRepository.save(company);
  }

  async remove(company: Company): Promise<Company> {
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

  async addUser(company: Company, addUserDto: AddUserDto): Promise<Company> {
    const user = await this.usersService.create({
      ...addUserDto,
      isAdmin: false,
    });
    company.users = [...company.users, user];
    return await this.companyRepository.save(company);
  }

  async removeUser(company: Company, user: User): Promise<Company> {
    const reason = this.canRemoveUser(company, user);
    if (reason) {
      return Promise.reject(reason);
    }

    company.users = company.users.filter(u => u.id !== user.id);

    return await this.companyRepository.save(company);
  }

  private canRemoveUser(company: Company, user: User): string | null {
    if (company.representative.id === user.id) {
      return 'Não é possível remover o representante da empresa.';
    } else if (company.users.length === 1) {
      return 'Não é possível remover o único usuário da empresa.';
    } else if (company.users.length === 0) {
      return 'Não há usuários para serem removidos.';
    } else if (!company.users.find(user => user.id === user.id)) {
      return 'O usuário informado não pertence a esta empresa.';
    }
    return null;
  }
}
