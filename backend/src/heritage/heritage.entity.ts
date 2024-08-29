import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
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

  @RelationId((heritage: Heritage) => heritage.place)
  placeId: number;
}
