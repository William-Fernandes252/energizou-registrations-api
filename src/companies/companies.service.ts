import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { AdressesService } from 'src/adresses/adresses.service';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly usersService: UsersService,
    private readonly adressesService: AdressesService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const user = await this.usersService.findOne(
      createCompanyDto.representative,
    );
    if (!user) {
      return Promise.reject('User not found');
    }
    const adress = await this.adressesService.getOrCreate({
      number: createCompanyDto.number,
      street: createCompanyDto.street,
    });

    const newCompany = new Company();
    Object.assign(newCompany, {
      ...createCompanyDto,
      representative: user,
      users: [user],
      address: adress,
    });

    return await this.companyRepository.save(newCompany);
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async findOne(id: Company['id']): Promise<Company | null> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new NotFoundException();
    }
    return company;
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
    if (updateCompanyDto.number || updateCompanyDto.street) {
      existingCompany.adress.number =
        updateCompanyDto.number || existingCompany.adress.number;
      existingCompany.adress.street =
        updateCompanyDto.street || existingCompany.adress.street;
      await this.adressesService.update(existingCompany.adress.id, {
        number: existingCompany.adress.number,
        street: existingCompany.adress.street,
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
    const user = await this.usersService.create({
      name: registrationData.name,
      email: registrationData.email,
      password: registrationData.password,
    });
    return await this.create({
      name: registrationData.name,
      cnpj: registrationData.cnpj,
      representative: user.id,
      phone: registrationData.phone,
      number: registrationData.number,
      street: registrationData.street,
    });
  }
}
