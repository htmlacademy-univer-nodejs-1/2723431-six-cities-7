import {OfferInput} from '../types/offer.type.js';

export function serializeOffer(offer: OfferInput): string {
  return [
    offer.title,
    offer.description,
    offer.publicationDate.toISOString(),
    offer.city,
    offer.previewImage,
    offer.images.join(';'),
    offer.isPremium,
    offer.isFavorite,
    offer.rating,
    offer.housingType,
    offer.rooms,
    offer.guests,
    offer.price,
    offer.amenities.join(';'),
    offer.author.name,
    offer.author.email,
    offer.author.avatar ?? '',
    offer.author.password,
    offer.author.type,
    offer.coordinates.latitude,
    offer.coordinates.longitude,
  ].join('\t');
}
