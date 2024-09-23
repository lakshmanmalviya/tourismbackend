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

  // async search(query: SearchQueryDto):Promise<SearchAllResponse> {
  //   console.log(" this is query param for search " , query)
  //   try {
  //     switch (query.entityType) {
  //       case EntityType.ALL:
  //         return await this.searchAllEntities(query);
  //       case EntityType.PLACE:
  //         return await this.searchPlaces(query);
  //       case EntityType.HERITAGE:
  //         return await this.searchHeritages(query);
  //       case EntityType.HOTEL:
  //         return await this.searchHotels(query);
  //       default:
  //         throw new BadRequestException('Invalid entity type');
  //     }
  //   } catch (error) {
  //     console.log( error)
  //     throw new BadRequestException(
  //       'Internal server error occurred while performing search',
  //     );
  //   }
  // }

  // private async searchAllEntities(query: SearchQueryDto): Promise<SearchAllResponse> {
  //   const page = query.page || 1;
  //   const limit = query.limit || 10;
  //   const offset = (page - 1) * limit;
  //   const allData = await this.datasource.query(
  //     `SELECT * FROM 
  //     (SELECT p.id, p.name, p.description, 'PLACE' AS entity, p.thumbnailUrl
  //      FROM place p
  //      WHERE p.name LIKE "$%{query.keyword}%" AND p.isDeleted = false
  //      GROUP BY p.id
  //      UNION 
  //      SELECT h.id, h.name, h.description, 'HOTEL' AS entity,  h.thumbnailUrl
  //      FROM hotel h
  //      WHERE h.name LIKE "%${query.keyword}%" AND h.isDeleted = false
  //      GROUP BY h.id
  //      UNION 
  //      SELECT her.id, her.name, her.description, 'HERITAGE' AS entity, her.thumbnailUrl
  //      FROM heritage her
  //      WHERE her.name LIKE "%${query.keyword}%" AND her.isDeleted = false
  //      GROUP BY her.id) 
  //     AS A 
  //     LIMIT ? OFFSET ?`,
  //     [limit, offset],
  //   );

  //   const [totalCountResult] = await this.datasource.query(
  //     `SELECT COUNT(*) AS totalCount FROM 
  //     (SELECT id FROM place WHERE isDeleted = false AND name LIKE "%${query.keyword}%"
  //      UNION
  //      SELECT id FROM heritage WHERE isDeleted = false AND name LIKE "%${query.keyword}%"
  //      UNION
  //      SELECT id FROM hotel WHERE isDeleted = false AND name LIKE "%${query.keyword}%") 
  //     AS TotalEntities`,
  //   );

  //   const total = parseInt(totalCountResult.totalCount, 10);

  //   return {
  //     data: allData,
  //     total,
  //     page,
  //     limit,
  //   };
  // }

  // private async searchPlaces(query: SearchQueryDto): Promise<SearchPlacesResponse> {
  //   const options = this.buildCommonOptions(query);
    
  //   const [places, total] = await this.placeRepository.findAndCount({
  //     ...options,
  //     where: {
  //       ...options.where,
  //       name: query.keyword ? Like(`${query.keyword}%`) : undefined,
  //     },
  //   });
    
  //   const placeResponses: PlaceResponse[] = places.map((place) => ({
  //     id: place.id,
  //     name: place.name,
  //     description: place.description,
  //     thumbnailUrl: place.thumbnailUrl,
  //     entityType: 'PLACE', 
  //   }));
    
  //   return {
  //     data: placeResponses,
  //     total,
  //     page: query.page || 1,
  //     limit: query.limit || 10,
  //   };
  // }
  
  // private async searchHeritages(query: SearchQueryDto): Promise<SearchHeritagesResponse> {
  //   const options = this.buildHeritageOptions(query);
  //   console.log(" this is options for heritages query" , options);
  //   const [heritages, total] = await this.heritageRepository.findAndCount(options);
  //   console.log(" this is the heritage response " , heritages)
  //   const heritageResponses: HeritageResponse[] = heritages.map((heritage) => ({
  //     id: heritage.id,
  //     name: heritage.name,
  //     description: heritage.description,
  //     thumbnailUrl: heritage.thumbnailUrl,
  //     entityType: 'HERITAGE',   
  //     tags: heritage.tags,  
  //   }));
    
  //   return {
  //     data: heritageResponses,
  //     total,
  //     page: query.page || 1,
  //     limit: query.limit || 10,
  //   };
  // }
  

  // private async searchHotels(query: SearchQueryDto): Promise<SearchHotelsResponse> {
  //   const options = this.buildHotelOptions(query);
  
  //   const [hotels, total] = await this.hotelRepository.findAndCount(options);
    
  //   const hotelResponses: HotelResponse[] = hotels.map((hotel) => ({
  //     id: hotel.id,
  //     name: hotel.name,
  //     description: hotel.description,
  //     thumbnailUrl: hotel.thumbnailUrl,
  //     entityType: 'HOTEL',    
  //     hotelStarRating: hotel.hotelStarRating,  
  //     price: hotel.price,
  //   }));
    
  //   return {
  //     data: hotelResponses,
  //     total,
  //     page: query.page || 1,
  //     limit: query.limit || 10,
  //   };
  // }
  

  // private buildCommonOptions(
  //   query: SearchQueryDto,
  // ): FindManyOptions<Place | Hotel | Heritage> {
  //   const { page = 1, limit = 10, sortBy, sortOrder = 'DESC' } = query;
  //   const skip = (page - 1) * limit;
  //   return {
  //     skip,
  //     take: limit,
  //     where: { isDeleted: false },
  //     order: sortBy
  //       ? { [sortBy]: sortOrder as 'ASC' | 'DESC' }
  //       : { name: 'DESC' },
  //   };
  // }

  // private buildHeritageOptions(
  //   query: SearchQueryDto,
  // ): FindManyOptions<Heritage> {
  //   const options = this.buildCommonOptions(query);
  //   let place;
  //   if (query.placeId) {
  //     place = { id: query.placeId };
  //   }
  //   const tagIdsArray =  query.tagIds ? query.tagIds.split(',')  : [];
  //   const formattedTagIds = JSON.stringify(tagIdsArray);
  //   // const tagConditions = tagIdsArray.map(tag => `FIND_IN_SET(${tag}, tags) > 0`).join(' OR ');
    
  //   return {
  //     ...options,
  //     where: {
  //       ...options.where,
  //       name: query.keyword ? Like(`${query.keyword}%`) : undefined,
  //       place: place || undefined, 
  //   tags: tagIdsArray.length
  //   ? Raw((alias) => `JSON_CONTAINS(${alias}, :formattedTagIds)`, { formattedTagIds })
  //   : undefined,
  //     },
  //   };
  // }

  // private buildHotelOptions(query: SearchQueryDto): FindManyOptions<Hotel> {
  //   const options = this.buildCommonOptions(query);
  //   let place;
  //   if (query.placeId) {
  //     place = { id: query.placeId };
  //   }

  //   return {
  //     ...options,
  //     where: {
  //       ...options.where,
  //       name: query.keyword ? Like(`%${query.keyword}%`) : undefined,
  //       hotelStarRating: query.hotelStarRating || undefined,
  //       place: place,
  //       registrationStatus: RegistrationStatus.ACCEPTED,
  //       isDeleted: false,
  //       price: this.buildPriceFilter(query.minPrice, query.maxPrice),
  //     },
  //   };
  // }

  // private buildPriceFilter(minPrice?: number, maxPrice?: number) {
  //   if (minPrice && maxPrice) {
  //     return Between(minPrice, maxPrice);
  //   }
  //   if (minPrice) {
  //     return Between(minPrice, 100000);
  //   }
  //   if (maxPrice) {
  //     return Between(0, maxPrice);
  //   }
  //   return undefined;
  // }

//   async search(query: SearchQueryDto): Promise<SearchAllResponse> {
//     const page = query.page || 1;
//     const limit = query.limit || 10;
//     const offset = (page - 1) * limit;

   
//     const entityTypeCondition = (() => {
//       switch (query.entityType) {
//         case EntityType.PLACE:
//           return `
//             SELECT p.id, p.name, p.description, p.thumbnailUrl, 'PLACE' AS entityType, COUNT(*) OVER() AS total_count
//             FROM place p
//             WHERE p.isDeleted = false
//             AND ${query.keyword ? `p.name LIKE '%${query.keyword}%'` : true}
//           `;
//         case EntityType.HOTEL:
//           return `
//             SELECT h.id, h.name, h.description, h.thumbnailUrl, 'HOTEL' AS entityType, h.hotelStarRating, h.price, COUNT(*) OVER() AS total_count
//             FROM hotel h
//             WHERE h.isDeleted = false
//             AND ${query.keyword ? `h.name LIKE '%${query.keyword}%'` : true}
//             ${query.hotelStarRating ? `AND h.hotelStarRating = ${query.hotelStarRating}` : ''}
//             ${query.minPrice && query.maxPrice ? `AND h.price BETWEEN ${query.minPrice} AND ${query.maxPrice}` : ''}
//           `;
//         case EntityType.HERITAGE:
//           return `
//             SELECT her.id, her.name, her.description, her.thumbnailUrl, 'HERITAGE' AS entityType, her.tags, COUNT(*) OVER() AS total_count
//             FROM heritage her
//             WHERE her.isDeleted = false
//             AND ${query.keyword ? `her.name LIKE '%${query.keyword}%'` : true}
//             ${query.tags && query.tags.length > 0 ? `AND her.tags && ARRAY[${query.tags.join(',')}]::int[]` : ''}
//             ${query.placeId ? `AND her.placeId = ${query.placeId}` : ''}
//           `;
//         default: 
//           return `
//             SELECT p.id, p.name, p.description, p.thumbnailUrl, 'PLACE' AS entityType, COUNT(*) OVER() AS total_count
//             FROM place p
//             WHERE p.isDeleted = false
//             AND ${query.keyword ? `p.name LIKE '%${query.keyword}%'` : true}

//             UNION ALL

//             SELECT h.id, h.name, h.description, h.thumbnailUrl, 'HOTEL' AS entityType, COUNT(*) OVER() AS total_count
//             FROM hotel h
//             WHERE h.isDeleted = false
//             AND ${query.keyword ? `h.name LIKE '%${query.keyword}%'` : true}

//             UNION ALL

//             SELECT her.id, her.name, her.description, her.thumbnailUrl, 'HERITAGE' AS entityType, COUNT(*) OVER() AS total_count
//             FROM heritage her
//             WHERE her.isDeleted = false
//             AND ${query.keyword ? `her.name LIKE '%${query.keyword}%'` : true}
//           `;
//       }
//     })();

   
//     const sql = `
//       ${entityTypeCondition}
//       ORDER BY name DESC
//       LIMIT ${limit} OFFSET ${offset};
//     `;

//     const allData = await this.datasource.query(sql);

//     const total = allData.length > 0 ? parseInt(allData[0].total_count, 10) : 0;

//     return {
//       data: allData,
//       total,
//       page,
//       limit,
//     };
// }



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


// async search(query: SearchQueryDto): Promise<SearchAllResponse> {
//   const page = query.page || 1;
//   const limit = query.limit || 10;
//   const offset = (page - 1) * limit;

//   const tagIdsArray = query.tagIds ? query.tagIds.split(',') : [];
//   const formattedTagIds = tagIdsArray.length > 0 ? `JSON_ARRAY(${tagIdsArray.map(tag => `'${tag}'`).join(', ')})` : null;
// try{

//   const entityTypeCondition = (() => {
//     switch (query.entityType) {
//       case EntityType.PLACE:
//         return `
//           SELECT p.id, p.name, p.description, p.thumbnailUrl, 'PLACE' AS entityType, COUNT(*) OVER() AS total_count
//           FROM place p
//           WHERE p.isDeleted = false
//           AND ${query.keyword ? `p.name LIKE '%${query.keyword}%'` : 'true'}
//         `;
//       case EntityType.HOTEL:
//         return `
//           SELECT h.id, h.name, h.description, h.thumbnailUrl, 'HOTEL' AS entityType, h.hotelStarRating, h.price, COUNT(*) OVER() AS total_count
//           FROM hotel h
//           WHERE h.isDeleted = false
//           AND ${query.keyword ? `h.name LIKE '%${query.keyword}%'` : 'true'}
//           ${query.hotelStarRating ? `AND h.hotelStarRating = ${query.hotelStarRating}` : ''}
//           ${query.minPrice && query.maxPrice ? `AND h.price BETWEEN ${query.minPrice} AND ${query.maxPrice}` : ''}
//           `;
//           case EntityType.HERITAGE:
//             return `
//             SELECT her.id, her.name, her.description, her.thumbnailUrl, 'HERITAGE' AS entityType, her.tags, COUNT(*) OVER() AS total_count
//             FROM heritage her
//             WHERE her.isDeleted = false
//             AND ${query.keyword ? `her.name LIKE '%${query.keyword}%'` : 'true'}
//           ${formattedTagIds ? `AND JSON_CONTAINS(her.tags, ${formattedTagIds}, '$')` : ''}
//           ${query.placeId ? `AND her.placeId = '${query.placeId}'` : ''}
//           `;
//       default:
//         return `
  
//            SELECT p.id, p.name, p.description, p.thumbnailUrl, 'PLACE' AS entityType
//           FROM place p
//           WHERE p.isDeleted = false
//           AND ${query.keyword ? `p.name LIKE '%${query.keyword}%'` : 'true'}
          
//           UNION ALL
          
//           SELECT h.id, h.name, h.description, h.thumbnailUrl, 'HOTEL' AS entityType
//           FROM hotel h
//           WHERE h.isDeleted = false
//           AND ${query.keyword ? `h.name LIKE '%${query.keyword}%'` : 'true'}
          
//           UNION ALL
          
//           SELECT her.id, her.name, her.description, her.thumbnailUrl, 'HERITAGE' AS entityType
//           FROM heritage her
//           WHERE her.isDeleted = false
//           AND ${query.keyword ? `her.name LIKE '%${query.keyword}%'` : 'true'})
      
//           `;
//         }
//       })();
      
      
//       const sql = `
//       ${entityTypeCondition}
//     ORDER BY name DESC
//     LIMIT ${limit} OFFSET ${offset};
//   `;


//   const allData = await this.datasource.query(sql);


//   const total = allData.length > 0 ? parseInt(allData[0].total_count, 10) : 0;
  
//   console.log(" this is the data for total count " , entityTypeCondition)
  
//     return {
//       data: allData,
//       total,
//       page,
//       limit,
//     };
  
// } catch(erro) {
//   console.log(erro);
// }
// }
}

