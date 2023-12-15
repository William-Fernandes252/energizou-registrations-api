import { MockFactory, Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { beforeEach, it, expect, describe, vi, afterEach } from 'vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { MockType } from 'src/__tests__/utils';

export const addressRepositoryMockFactory: MockFactory = vi.fn(() => ({
  save: vi.fn(),
  find: vi.fn(),
  findOneBy: vi.fn(),
  remove: vi.fn(),
}));

export function createFakeAddress(): Address {
  return {
    id: faker.string.uuid(),
    number: faker.string.numeric({ length: 3 }),
    street: faker.location.street(),
    cep: faker.location.zipCode(),
    created: faker.date.past(),
    updated: faker.date.past(),
  };
}

export function createFakeAddresses(): Address[] {
  return Array(10).fill(null).map(createFakeAddress);
}

describe('AddressesService', () => {
  let service: AddressesService;
  let repository: MockType<Repository<Address>>;
  let addresses: Address[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: getRepositoryToken(Address),
          useFactory: addressRepositoryMockFactory,
        },
      ],
    }).compile();

    addresses = createFakeAddresses();
    service = module.get<AddressesService>(AddressesService);
    repository = module.get<MockType<Repository<Address>>>(
      getRepositoryToken(Address),
    );

    repository.findOneBy.mockImplementation(({ cep, street, number, id }) =>
      addresses.find(
        a =>
          (a.cep === cep && a.street === street && a.number === number) ||
          a.id === id,
      ),
    );
    repository.find.mockImplementation(() => addresses);
    repository.save.mockImplementation(address => {
      const obj = {
        ...address,
        created: address.created || new Date(),
        updated: new Date(),
        id: address.id || faker.string.uuid(),
      };
      addresses.push(obj);
      return obj;
    });
    repository.remove.mockImplementation(address => {
      addresses = addresses.filter(a => a.id !== address.id);
      return address;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create an address', async () => {
      const address = await service.create({
        number: faker.string.numeric({ length: 3 }),
        street: faker.location.street(),
        cep: faker.location.zipCode(),
      });
      expect(address).toBeDefined();
      expect(address.id).toBeDefined();
      expect(address.number).toBeDefined();
      expect(address.street).toBeDefined();
      expect(address.cep).toBeDefined();
      expect(address.created).toBeDefined();
      expect(address.updated).toBeDefined();
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return all addresses', async () => {
      const addresses = await service.findAll();
      expect(addresses).toBeDefined();
      expect(addresses.length).toBeGreaterThan(0);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an address by id', async () => {
      const address = await service.findOne(addresses[0].id);
      expect(address).toBeDefined();
      expect(address.id).toBe(addresses[0].id);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneBy', () => {
    it('should return an address by number, street and cep', async () => {
      const address = await service.findOneBy({
        number: addresses[0].number,
        street: addresses[0].street,
        cep: addresses[0].cep,
      });
      expect(address).toBeDefined();
      expect(address.id).toBe(addresses[0].id);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const address = await service.update(addresses[0].id, {
        number: faker.string.numeric({ length: 3 }),
        street: faker.location.street(),
        cep: faker.location.zipCode(),
      });
      expect(address).toBeDefined();
      expect(address.id).toBe(addresses[0].id);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove an address', async () => {
      const removedAddress = { ...addresses[0] };
      const address = await service.remove(addresses[0].id);
      expect(address).toBeDefined();
      expect(address.id).toBe(removedAddress.id);
      expect(repository.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOrCreate', () => {
    it('should return an address if it exists', async () => {
      const address = await service.getOrCreate({
        number: addresses[0].number,
        street: addresses[0].street,
        cep: addresses[0].cep,
      });
      expect(address).toBeDefined();
      expect(address.id).toBe(addresses[0].id);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should create an address if it does not exist', async () => {
      const address = await service.getOrCreate({
        number: faker.string.numeric({ length: 3 }),
        street: faker.location.street(),
        cep: faker.location.zipCode(),
      });
      expect(address).toBeDefined();
      expect(address.id).toBeDefined();
      expect(address.number).toBeDefined();
      expect(address.street).toBeDefined();
      expect(address.cep).toBeDefined();
      expect(address.created).toBeDefined();
      expect(address.updated).toBeDefined();
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
