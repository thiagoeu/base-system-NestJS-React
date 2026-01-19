import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by_user', nullable: true })
  createdByUser?: number;

  @Column({ name: 'updated_by_user', nullable: true })
  updatedByUser?: number;

  @Column({ default: true })
  active: boolean;
}
