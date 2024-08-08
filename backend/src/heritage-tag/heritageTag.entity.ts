import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Heritage } from '../heritage/heritage.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class HeritageTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Heritage)
  heritage: Heritage;

  @ManyToOne(() => Tag)
  tag: Tag;
}