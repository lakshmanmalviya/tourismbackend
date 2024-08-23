import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Place } from './place.entity';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { ImageService } from 'src/image/image.service';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Place]), AuthModule, ImageModule],
  providers: [PlaceService],
  controllers: [PlaceController]
})
export class PlaceModule {}
