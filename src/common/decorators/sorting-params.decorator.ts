import {
  BadRequestException,
  type ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { Order } from '../enums';

export type Sorting = {
  property: string;
  direction: Order;
};

export const SortingParams = createParamDecorator(
  <T extends Record<string, unknown>>(
    validFields: (keyof T)[],
    context: ExecutionContext,
  ): Sorting => {
    const request = context.switchToHttp().getRequest();

    const sort = request.query.sort as string;
    if (!sort) {
      return null;
    }

    const sortPattern = /^([a-zA-Z0-9]+):(ASC|DESC)$/;
    if (!sort.match(sortPattern)) {
      throw new BadRequestException(
        'Parâmetro de ordenação inválido. Deve seguir o formato "campo:ordem"',
      );
    }

    const [property, direction] = sort.split(':');
    if (!validFields.includes(property)) {
      throw new BadRequestException(`Campo de ordenação inválido: ${property}`);
    }

    return { property, direction } as Sorting;
  },
);

export function getOrder(sort?: Sorting) {
  return sort ? { [sort.property]: sort.direction } : null;
}
