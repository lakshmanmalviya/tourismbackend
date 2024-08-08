import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Place } from '../place/place.entity';

@Entity()
export class Heritage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Place, place => place.heritages)
  place: Place;
}