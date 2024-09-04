
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  InjectDataSource,
  InjectRepository,
} from '@nestjs/typeorm';
import { Heritage } from 'src/heritage/heritage.entity';
import { Hotel } from 'src/hotel/hotel.entity';
import { Place } from 'src/place/place.entity';
import {
  Between,
  DataSource,
  FindManyOptions,
  Like,
  Raw,
  Repository,
} from 'typeorm';
import { SearchQueryDto } from './dto/search-query.dto';
import { EntityType } from 'src/types/entityType.enum';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(Heritage)
    private readonly heritageRepository: Repository<Heritage>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}

  async search(query: SearchQueryDto) {
    this.logger.debug(`Starting search with query: ${JSON.stringify(query)}`);

    try {
      switch (query.entityType) {
        case EntityType.ALL:
          return await this.searchAllEntities(query);
        case EntityType.PLACE:
          return await this.searchPlaces(query);
        case EntityType.HERITAGE:
          return await this.searchHeritages(query);
        case EntityType.HOTEL:
          return await this.searchHotels(query);
        default:
          throw new BadRequestException('Invalid entity type');
      }
    } catch (error) {
      this.logger.error('An error occurred during search', error.stack);
      throw new BadRequestException(
        'Internal server error occurred while performing search',
      );
    }
  }

  private async searchAllEntities(query: SearchQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const offset = (page - 1) * limit;

    const allData = await this.datasource.query(
      `SELECT * FROM 
      (SELECT name, description, 'PLACE' as entity FROM place 
      UNION 
      SELECT name, description, 'HERITAGE' as entity FROM heritage 
      UNION 
      SELECT name, description, 'HOTEL' as entity FROM hotel) 
      AS A 
      WHERE A.name LIKE "%${query.keyword}%"
      LIMIT ${limit} OFFSET ${offset}`,
    );

    this.logger.debug('data from query : is ', allData);
    return { allData };
  }

  private async searchPlaces(query: SearchQueryDto) {
    const options = this.buildCommonOptions(query);
    const places = await this.placeRepository.find({
      ...options,
      where: {
        ...options.where,
        name: query.keyword ? Like(`%${query.keyword}%`) : undefined,
      },
    });

    this.logger.debug(`Search results for PLACES: ${places.length} found`);
    return places;
  }

  private async searchHeritages(query: SearchQueryDto) {
    const options = this.buildHeritageOptions(query);
    const heritages = await this.heritageRepository.find(options);

    this.logger.debug(`Search results for HERITAGE: ${heritages.length} found`);
    return heritages;
  }

  private async searchHotels(query: SearchQueryDto) {
    const options = this.buildHotelOptions(query);
    const hotels = await this.hotelRepository.find(options);

    this.logger.debug(`Search results for HOTELS: ${hotels.length} found`);
    return hotels;
  }

  private buildCommonOptions(
    query: SearchQueryDto,
  ): FindManyOptions<Place | Hotel | Heritage> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'ASC' } = query;
    const skip = (page - 1) * limit;
    console.log('Skip is here: ', skip, page, limit);
    return {
      skip,
      take: limit,
      where: { isDeleted: false },
      order: sortBy
        ? { [sortBy]: sortOrder as 'ASC' | 'DESC' }
        : { name: 'ASC' },
    };
  }

  private buildHeritageOptions(
    query: SearchQueryDto,
  ): FindManyOptions<Heritage> {
    const options = this.buildCommonOptions(query);
    let place;
    if (query.placeId) {
      place = { id: query.placeId };
    }

    return {
      ...options,
      where: {
        ...options.where,
        name: query.keyword ? Like(`%${query.keyword}%`) : undefined,
        place: place || undefined,
        tags:
          query.tagIds && query.tagIds.length > 0
            ? Raw((alias) => `${alias} && :tagIds`, { tagIds: query.tagIds })
            : undefined,
      },
    };
  }

  private buildHotelOptions(query: SearchQueryDto): FindManyOptions<Hotel> {
    const options = this.buildCommonOptions(query);
    let place;
    if (query.placeId) {
      place = { id: query.placeId };
    }

    return {
      ...options,
      where: {
        ...options.where,
        name: query.keyword ? Like(`%${query.keyword}%`) : undefined,
        hotelStarRating: query.hotelStarRating || undefined,
        place: place,
        price: this.buildPriceFilter(query.minPrice, query.maxPrice),
      },
      relations: ['place', 'user'],
    };
  }

  private buildPriceFilter(minPrice?: number, maxPrice?: number) {
    if (minPrice && maxPrice) {
      return Between(minPrice, maxPrice);
    }
    if (minPrice) {
      return Between(minPrice, 100000);
    }
    if (maxPrice) {
      return Between(0, maxPrice);
    }
    return undefined;
  }
}
