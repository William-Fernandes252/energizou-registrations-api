import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  SerializeOptions,
  UnprocessableEntityException,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, Groups } from './entities/company.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl-ability.factory';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { PageOptionsDto } from 'src/common/dto/PageOptions.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('companies')
@UseGuards(PoliciesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.List, Company))
  @SerializeOptions({ groups: [Groups.List] })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto<Pick<Company, 'name' | 'created'>>,
  ) {
    return this.companiesService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Retrieve, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async findOne(@Param('id') id: Company['id']): Promise<Company> {
    const company = this.companiesService.findOne(id);
    if (!company) {
      throw new NotFoundException();
    }
    return company;
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async update(
    @Param('id') id: Company['id'],
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    let company: Company;
    try {
      company = await this.companiesService.update(id, updateCompanyDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }

    if (!company) {
      throw new NotFoundException();
    }

    return company;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPolicies(ability => ability.can(Action.Delete, Company))
  async remove(@Param('id') id: Company['id']): Promise<void> {
    const company = this.companiesService.remove(id);
    if (!company) {
      throw new NotFoundException();
    }
  }

  @Post('register')
  @CheckPolicies(ability => ability.can(Action.Create, Company))
  @SerializeOptions({ groups: [Groups.Detail] })
  async register(registrationDto: RegisterCompanyDto) {
    return this.companiesService.register(registrationDto);
  }
}
