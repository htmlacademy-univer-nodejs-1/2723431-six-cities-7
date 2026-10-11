import {User} from './user.type.js';

export type City = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
export type HousingType = 'apartment' | 'house' | 'room' | 'hotel';
export type Amenity = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' |
  'Baby seat' | 'Washer' | 'Towels' | 'Fridge';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type OfferImages = [string, string, string, string, string, string];

export type Offer = {
  title: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  images: OfferImages;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentCount: number;
  coordinates: Coordinates;
};

export type OfferInput = Omit<Offer, 'commentCount'>;
