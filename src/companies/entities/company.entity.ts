import { Expose } from 'class-transformer';
import { Address } from 'src/addresses/entities/address.entity';
import { TimestampedEntity } from 'src/common/entities/timestamped.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum Groups {
  Detail = 'detail',
  List = 'list',
}

@Entity()
export class Company extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Expose({ groups: [Groups.Detail, Groups.List] })
  reason: string;

  @Column({ length: '14', unique: true })
  @Expose({ groups: [Groups.Detail, Groups.List] })
  cnpj: string;

  @Column({ length: '11' })
  @Expose({ groups: [Groups.Detail, Groups.List] })
  phone: string;

  @OneToOne(() => User, (user: User) => user.company, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn()
  @Expose({ groups: [Groups.Detail, Groups.List] })
  representative: User;

  @OneToMany(() => User, (user: User) => user.company, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @Expose({ groups: [Groups.Detail] })
  users: User[];

  @OneToOne(() => Address, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Expose({ groups: [Groups.Detail] })
  @JoinColumn()
  address: Address;
}
