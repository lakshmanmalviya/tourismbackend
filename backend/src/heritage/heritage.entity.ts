import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
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

  @Column('json', { nullable: true })
  tags: number[];

  @ManyToOne(() => Place, place => place.id)
  place: Place;
}
