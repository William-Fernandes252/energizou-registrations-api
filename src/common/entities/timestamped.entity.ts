import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface Timestamped {
  created: Date;
  updated: Date;
}

export abstract class TimestampedEntity implements Timestamped {
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
