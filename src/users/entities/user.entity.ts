import { hash, verify } from 'argon2';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Company } from 'src/companies/entities/company.entity';
import { ParanoidEntity } from 'src/common/entities/paranoid.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class User extends ParanoidEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: '128' })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @ApiHideProperty()
  isAdmin: boolean = false;

  @ManyToOne(() => Company, (company: Company) => company.users, {
    nullable: true,
  })
  company?: Relation<Company>;

  async hashPassword(password: string) {
    this.password = await hash(password);
  }

  async checkPassword(password: string): Promise<boolean> {
    return await verify(this.password, password);
  }
}
