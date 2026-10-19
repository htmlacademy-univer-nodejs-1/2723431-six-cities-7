import {OfferInput} from './offer.type.js';

export type OfferTemplate = Omit<OfferInput,
  'publicationDate' | 'isPremium' | 'isFavorite' | 'rating' | 'rooms' | 'guests' | 'price'
>;

export type MockServerData = {
  offers: OfferTemplate[];
};
