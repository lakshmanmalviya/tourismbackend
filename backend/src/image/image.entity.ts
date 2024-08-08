import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum EntityType {
  PLACE = 'PLACE',
  HOTEL = 'HOTEL',
  HERITAGE = 'HERITAGE',
}

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicID: string;

  @Column({ type: 'enum', enum: EntityType })
  entityType: EntityType;

  @Column()
  entityId: number;

  @Column()
  imageLink: string;

  @Column({ default: false })
  isDeleted: boolean;
}