import {getRandomInteger, getRandomItem} from '../helpers/random.js';
import {MockServerData} from '../types/mock-server-data.type.js';
import {OfferInput} from '../types/offer.type.js';

export function generateOffer(data: MockServerData): OfferInput {
  const template = getRandomItem(data.offers);

  return {
    ...template,
    publicationDate: new Date(Date.now() - getRandomInteger(0, 30) * 24 * 60 * 60 * 1000),
    isPremium: getRandomInteger(0, 1) === 1,
    isFavorite: getRandomInteger(0, 1) === 1,
    rating: getRandomInteger(10, 50) / 10,
    rooms: getRandomInteger(1, 8),
    guests: getRandomInteger(1, 10),
    price: getRandomInteger(100, 100000),
    amenities: template.amenities.slice(0, getRandomInteger(1, template.amenities.length)),
  };
}
