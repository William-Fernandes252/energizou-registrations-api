import { TimestampedEntity, type Timestamped } from './timestamped.entity';
import { DeleteDateColumn } from 'typeorm';

export interface Paranoid extends Timestamped {
  deleted: Date;
}

export abstract class ParanoidEntity
  extends TimestampedEntity
  implements Paranoid
{
  @DeleteDateColumn()
  deleted: Date;
}
