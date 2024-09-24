import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
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
import { RegistrationStatus } from 'src/types/registrationStatus.enum';
import { HeritageResponse, HotelResponse, PlaceResponse, SearchAllResponse, SearchHeritagesResponse, SearchHotelsResponse, SearchPlacesResponse } from './dto/search-response.dto';

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

async search(query: SearchQueryDto): Promise<SearchAllResponse> {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const offset = (page - 1) * limit;

  const tagIdsArray = query.tagIds ? query.tagIds.split(',') : [];
  const formattedTagIds = JSON.stringify(tagIdsArray);

  const baseQuery = (() => {
    switch (query.entityType) {
      case EntityType.PLACE:
        return `
          SELECT id, name, description, thumbnailUrl, 'PLACE' AS entity
          FROM place
          WHERE isDeleted = false
          AND ${query.keyword ? `name LIKE '%${query.keyword}%'` : 'true'}
        `;
      case EntityType.HOTEL:
        return `
          SELECT id, name, description, thumbnailUrl, 'HOTEL' AS entity, hotelStarRating, price
          FROM hotel
          WHERE isDeleted = false
          AND ${query.keyword ? `name LIKE '%${query.keyword}%'` : 'true'}
          ${query.hotelStarRating ? `AND hotelStarRating = ${query.hotelStarRating}` : ''}
          ${query.minPrice && query.maxPrice ? `AND price BETWEEN ${query.minPrice} AND ${query.maxPrice}` : ''}
        `;
      case EntityType.HERITAGE:
        return `
          SELECT id, name, description, thumbnailUrl, 'HERITAGE' AS entity, tags
          FROM heritage
          WHERE isDeleted = false
          AND ${query.keyword ? `name LIKE '%${query.keyword}%'` : 'true'}
          ${formattedTagIds ? `AND JSON_CONTAINS(tags, '${formattedTagIds}', '$')` : ''}
          ${query.placeId ? `AND placeId = '${query.placeId}'` : ''}
        `;
      default:
        return `
          SELECT id, name, description, thumbnailUrl, 'PLACE' AS entity
          FROM place
          WHERE isDeleted = false
          AND ${query.keyword ? `name LIKE '%${query.keyword}%'` : 'true'}
          
          UNION ALL

          SELECT id, name, description, thumbnailUrl, 'HOTEL' AS entity
          FROM hotel
          WHERE isDeleted = false
          AND ${query.keyword ? `name LIKE '%${query.keyword}%'` : 'true'}
          
          UNION ALL

          SELECT id, name, description, thumbnailUrl, 'HERITAGE' AS entity
          FROM heritage
          WHERE isDeleted = false
          AND ${query.keyword ? `name LIKE '%${query.keyword}%'` : 'true'}
        `;
    }
  })();

  const countQuery = `
    SELECT COUNT(*) AS total_count
    FROM (${baseQuery}) AS combined_query
  `;
  
  const paginatedQuery = `
    ${baseQuery}
    ORDER BY name DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const countResult = await this.datasource.query(countQuery);
  const allData = await this.datasource.query(paginatedQuery);
  const total = countResult.length > 0 ? parseInt(countResult[0].total_count, 10) : 0;

  return {
    data: allData,
    total,
    page,
    limit,
  };
}

}