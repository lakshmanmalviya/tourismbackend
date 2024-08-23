import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityType } from '../types/entityType.enum';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicID: string;

  @Column({ type: 'enum', enum: EntityType })
  entityType: EntityType;

  @Column()
  entityId: string;

  @Column()
  imageLink: string;

  @Column({ default: false })
  isDeleted: boolean;
}

export { EntityType };
