import {model, Schema, Types} from 'mongoose';
import {Offer} from '../types/offer.type.js';

export type OfferEntity = Omit<Offer, 'author' | 'isFavorite'> & {
  author: Types.ObjectId;
  ratingSum: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const coordinatesSchema = new Schema({
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true}
}, {_id: false});

const offerSchema = new Schema<OfferEntity>({
  title: {type: String, required: true},
  description: {type: String, required: true},
  publicationDate: {type: Date, required: true},
  city: {type: String, required: true},
  previewImage: {type: String, required: true},
  images: {type: [String], required: true},
  isPremium: {type: Boolean, required: true},
  rating: {type: Number, default: 0},
  ratingSum: {type: Number, default: 0},
  housingType: {type: String, required: true},
  rooms: {type: Number, required: true},
  guests: {type: Number, required: true},
  price: {type: Number, required: true},
  amenities: {type: [String], required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  commentCount: {type: Number, default: 0},
  coordinates: {type: coordinatesSchema, required: true}
}, {timestamps: true, collection: 'offers'});

export const OfferModel = model<OfferEntity>('Offer', offerSchema);
