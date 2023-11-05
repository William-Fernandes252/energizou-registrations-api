import bcrypt from 'bcrypt';
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
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
