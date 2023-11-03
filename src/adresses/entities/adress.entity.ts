import { TimestampedEntity } from 'src/common/entities/timestamped.entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['number', 'street'])
export class Adress extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 3 })
  number: string;

  @Column()
  street: string;
}
