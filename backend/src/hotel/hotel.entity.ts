import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Place } from '../place/place.entity';
import { User } from '../user/user.entity';

export enum RegistrationStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  websiteLink: string;

  @Column()
  hotelStarRating: number;

  @Column()
  address: string;

  @Column()
  availableRooms: number;

  @Column()
  price: number;

  @Column({ type: 'enum', enum: RegistrationStatus, default: RegistrationStatus.PENDING })
  registrationStatus: RegistrationStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Place)
  place: Place;

  @ManyToOne(() => User)
  user: User;
}