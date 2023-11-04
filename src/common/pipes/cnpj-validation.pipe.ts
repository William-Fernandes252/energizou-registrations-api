import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { cnpj } from 'cpf-cnpj-validator';

@Injectable()
export class CnpjValidationPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!value || !cnpj.isValid(value)) {
      throw new BadRequestException('Invalid CNPJ');
    }
    return value;
  }
}
