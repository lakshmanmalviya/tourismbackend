import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Place } from '../place/place.entity';
import { User } from '../user/user.entity';
import { RegistrationStatus } from 'src/types/registrationStatus.enum';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  websiteLink?: string;

  @Column({ nullable: true })
  contact?: string;

  @Column()
  hotelStarRating: number;

  @Column()
  address: string;

  @Column()
  availableRooms: number;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING,
  })
  registrationStatus: RegistrationStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Place, (place) => place.id)
  place: Place;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
