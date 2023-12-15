import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { beforeEach, it, expect, describe, vi, afterEach } from 'vitest';
import { createFakeAddresses } from './addresses.service.spec';
import { Address } from './entities/address.entity';
import { CaslModule } from 'src/casl/casl.module';

export function addressServiceMockFactory(addresses: Address[]) {
  return {
    findAll: vi.fn().mockResolvedValue(addresses),
    findOne: vi.fn(async id => addresses.find(a => a.id === id)),
  };
}

describe('AddressesController', () => {
  let controller: AddressesController;
  let addresses: Address[];

  beforeEach(async () => {
    addresses = createFakeAddresses();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CaslModule],
      controllers: [AddressesController],
    })
      .useMocker(token => {
        if (token === AddressesService) {
          return addressServiceMockFactory(addresses);
        }
      })
      .compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all addresses', async () => {
      expect(await controller.findAll()).toEqual(addresses);
    });
  });

  describe('findOne', () => {
    it('should return one address', async () => {
      const address = addresses[0];
      expect(await controller.findOne(address.id)).toEqual(address);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
