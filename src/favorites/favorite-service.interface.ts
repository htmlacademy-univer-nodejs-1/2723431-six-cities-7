import {HydratedDocument} from 'mongoose';
import {OfferDocument} from '../offers/offer-service.interface.js';
import {CreateFavoriteDto} from './dto/create-favorite.dto.js';
import {FavoriteEntity} from './favorite.model.js';

export type FavoriteDocument = HydratedDocument<FavoriteEntity>;

export interface FavoriteService {
  findByUserId(userId: string): Promise<OfferDocument[]>;
  exists(userId: string, offerId: string): Promise<boolean>;
  add(dto: CreateFavoriteDto): Promise<FavoriteDocument>;
  remove(userId: string, offerId: string): Promise<boolean>;
}
