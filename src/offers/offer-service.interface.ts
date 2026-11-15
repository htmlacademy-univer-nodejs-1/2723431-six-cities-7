import {HydratedDocument} from 'mongoose';
import {City} from '../types/offer.type.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferEntity} from './offer.model.js';

export type OfferDocument = HydratedDocument<OfferEntity>;

export interface OfferService {
  findById(id: string): Promise<OfferDocument | null>;
  findMany(limit?: number): Promise<OfferDocument[]>;
  findPremiumByCity(city: City): Promise<OfferDocument[]>;
  create(dto: CreateOfferDto): Promise<OfferDocument>;
  updateById(id: string, authorId: string, dto: UpdateOfferDto): Promise<OfferDocument | null>;
  deleteById(id: string, authorId: string): Promise<boolean>;
}
