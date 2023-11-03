import { Expose, Transform } from 'class-transformer';
import { Adress } from 'src/adresses/entities/adress.entity';
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
  @Expose({ groups: [Groups.Detail, Groups.List] })
  id: string;

  @Column({ length: '14', unique: true })
  @Expose({ groups: [Groups.Detail, Groups.List] })
  cnpj: string;

  @Column({ length: '11' })
  @Expose({ groups: [Groups.Detail, Groups.List] })
  phone: string;

  @OneToOne(() => User, (user: User) => user.company, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  @Expose({ groups: [Groups.Detail, Groups.List] })
  @Transform(({ value }) => value.email)
  representative: User;

  @OneToMany(() => User, (user: User) => user.company)
  @Expose({ groups: [Groups.Detail] })
  users: User[];

  @OneToOne(() => Adress, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @Expose({ groups: [Groups.Detail, Groups.List] })
  @JoinColumn()
  @Transform(({ value }) => `${value.street}, ${value.number}`)
  adress: Adress;
}
