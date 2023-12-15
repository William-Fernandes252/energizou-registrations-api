import { it, expect, describe, vi, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import { AddressesModule } from 'src/addresses/addresses.module';
import { AddressesService } from 'src/addresses/addresses.service';
import { createFakeAddresses } from 'src/addresses/addresses.service.spec';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from 'src/addresses/entities/address.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';

describe('Addresses', () => {
  let app: NestFastifyApplication;
  const addresses = createFakeAddresses();
  const service = { findAll: () => addresses };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AddressesModule],
    })
      .overrideProvider(AddressesService)
      .useValue(service)
      .overrideProvider(getRepositoryToken(Address))
      .useValue({ find: () => addresses })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: vi.fn().mockReturnValue(true) })
      .overrideGuard(PoliciesGuard)
      .useValue({ canActivate: vi.fn().mockReturnValue(true) })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /addresses', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/addresses',
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.json())).toEqual(
      JSON.stringify(service.findAll()),
    );
  });
});
