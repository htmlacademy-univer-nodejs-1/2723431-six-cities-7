import {Types} from 'mongoose';
import {OfferEntity} from '../offer.model.js';

export type CreateOfferDto = Omit<OfferEntity, 'rating' | 'ratingSum' | 'commentCount' | 'createdAt' | 'updatedAt'> & {
  author: Types.ObjectId;
};
