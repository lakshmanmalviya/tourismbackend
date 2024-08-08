import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { HeritageModule } from './heritage/heritage.module';
import { TagModule } from './tag/tag.module';
import { PlaceModule } from './place/place.module';
import { HeritageTagModule } from './heritage-tag/heritage-tag.module';
import { HotelModule } from './hotel/hotel.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'Tourism',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    HeritageModule,
    TagModule,
    PlaceModule,
    HeritageTagModule,
    HotelModule,
    ImageModule,
  ],
})

export class AppModule {
  constructor(private dataSource: DataSource) {}
}


