import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

export enum QueryStatus {
  SEEN = 'SEEN',
  UNSEEN = 'UNSEEN',
  RESPONDED = 'RESPONDED',
}

@Entity()
export class Query {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column('text')
  message: string;

  @Column({ type: 'enum', enum: QueryStatus, default: QueryStatus.UNSEEN })
  status: QueryStatus;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => User)
  user: User;
}