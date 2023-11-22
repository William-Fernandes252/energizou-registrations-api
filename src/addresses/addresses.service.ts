import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return await this.addressRepository.save(createAddressDto);
  }

  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find();
  }

  async findOne(id: Address['id']): Promise<Address | null> {
    return await this.addressRepository.findOneBy({ id });
  }

  async findOneBy({
    number,
    street,
  }: Partial<CreateAddressDto>): Promise<Address | null> {
    return await this.addressRepository.findOneBy({ number, street });
  }

  async update(
    id: Address['id'],
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const updatedAddress = this.addressRepository.findOneBy({ id });
    if (!updatedAddress) {
      return Promise.reject('Address not found');
    }
    return await this.addressRepository.save({
      ...updatedAddress,
      ...updateAddressDto,
    });
  }

  async remove(id: Address['id']): Promise<Address | null> {
    const removedAddress = await this.addressRepository.findOneBy({ id });
    if (!removedAddress) {
      return null;
    }
    return await this.addressRepository.remove(removedAddress);
  }

  async getOrCreate(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = await this.findOneBy(createAddressDto);
    if (address) {
      return address;
    }
    return await this.create(createAddressDto);
  }
}
