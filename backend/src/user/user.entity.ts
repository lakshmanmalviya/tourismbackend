import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from './roles.enum';
import {
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
    IsEnum,
  } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {message: 'Name must contain only alphabets'})
  @Column({ type: 'varchar', length: 255})
  @MinLength(3)
  fullName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.PROVIDER })
  @IsEnum(Role)
  roles: Role[];
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  token: string | null;

  @Column({ default: false })
  isDeleted: boolean;
}