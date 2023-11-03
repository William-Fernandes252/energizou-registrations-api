import { Injectable } from '@nestjs/common';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { Adress } from './entities/adress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdressesService {
  constructor(
    @InjectRepository(Adress) private adressRepository: Repository<Adress>,
  ) {}

  async create(createAdressDto: CreateAdressDto): Promise<Adress> {
    return await this.adressRepository.save(createAdressDto);
  }

  async findAll(): Promise<Adress[]> {
    return await this.adressRepository.find();
  }

  async findOne(id: Adress['id']): Promise<Adress | null> {
    return await this.adressRepository.findOneBy({ id });
  }

  async findOneBy({
    number,
    street,
  }: Partial<CreateAdressDto>): Promise<Adress | null> {
    return await this.adressRepository.findOneBy({ number, street });
  }

  async update(
    id: Adress['id'],
    updateAdressDto: UpdateAdressDto,
  ): Promise<Adress> {
    const updatedAdress = this.adressRepository.findOneBy({ id });
    if (!updatedAdress) {
      return Promise.reject('Adress not found');
    }
    return await this.adressRepository.save({
      ...updatedAdress,
      ...updateAdressDto,
    });
  }

  async remove(id: Adress['id']): Promise<Adress | null> {
    const removedAdress = await this.adressRepository.findOneBy({ id });
    if (!removedAdress) {
      return null;
    }
    return await this.adressRepository.remove(removedAdress);
  }

  async getOrCreate(createAdressDto: CreateAdressDto): Promise<Adress> {
    try {
      return await this.findOneBy(createAdressDto);
    } catch (error) {
      if (error.message === 'Adress not found') {
        return await this.create(createAdressDto);
      }
      throw error;
    }
  }
}
