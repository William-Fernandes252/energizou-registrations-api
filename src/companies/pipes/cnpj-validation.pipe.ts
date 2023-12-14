import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { cnpj } from 'cpf-cnpj-validator';

/**
 * CNPJ validation pipe.
 *
 * It verifies if the given CNPJ contains 14 digits and if it's valid.
 * If not, it throws an `BadRequestException`.
 *
 * @exports
 * @class CnpjValidationPipe
 * @implements {PipeTransform}
 */
@Injectable()
export class CNPJValidationPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!value || !cnpj.isValid(value)) {
      throw new BadRequestException('CNPJ inválido.');
    }
    return cnpj.strip(value);
  }
}
