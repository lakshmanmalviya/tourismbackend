import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Place } from 'src/place/place.entity';
import { Heritage } from 'src/heritage/heritage.entity';
import { Hotel } from 'src/hotel/hotel.entity';
import { SearchQueryDto } from './dto/search-query.dto';
import { EntityType } from 'src/types/entityType.enum';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(Heritage)
    private readonly heritageRepository: Repository<Heritage>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async search(query: SearchQueryDto) {
    const {
      keyword,
      entityType,
      hotelStarRating,
      minPrice,
      maxPrice,
      placeId,
      tagIds,
    } = query;

    console.log(query);

    if (entityType === EntityType.ALL) {
      let place = await this.placeRepository.find({
        where: { name: keyword, isDeleted: false },
      });

      if (place.length === 0) {
        place = null;
      }

      let heritages = await this.heritageRepository.find({
        where: { name: keyword, isDeleted: false },
      });

      if (heritages.length === 0) {
        heritages = null;
      }
      let hotels = await this.hotelRepository.find({
        where: { name: keyword, isDeleted: false },
      });

      if (hotels.length === 0) {
        hotels = null;
      }

      return { place, heritages, hotels };
    } else if (entityType === EntityType.PLACE) {
      return this.placeRepository.find({
        where: { name: keyword, isDeleted: false },
      });
    } else if (entityType === EntityType.HERITAGE) {
      const filters: any = { isDeleted: false };
      if (keyword) {
        filters.name = keyword;
      }
      if (placeId) {
        filters.placeId = placeId;
      }

      if (tagIds) {
        filters.tags = In(tagIds);
      }
      return this.heritageRepository.find(filters);
    } else if (entityType === EntityType.HOTEL) {
      const filters: any = { isDeleted: false };
      if (keyword) {
        filters.name = keyword;
      }

      if (hotelStarRating) {
        filters.hotelStarRating = hotelStarRating;
      }

      if (placeId) {
        const place = await this.placeRepository.find({
          where: { id: placeId },
        });

        filters.place = place;
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        filters.price = Between(minPrice, maxPrice);
      } else if (minPrice !== undefined) {
        filters.price = Between(minPrice, Infinity);
      } else if (maxPrice !== undefined) {
        filters.price = Between(0, maxPrice);
      }

      return this.hotelRepository.find({
        where: filters,
        relations: ['place', 'user'],
      });
    }

    throw new BadRequestException('Invalid entity type');
  }
}
