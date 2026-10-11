import {Amenity, City, HousingType, OfferImages, OfferInput} from '../types/offer.type.js';
import {UserType} from '../types/user.type.js';

export function parseOffer(line: string): OfferInput {
  const [title, description, date, city, previewImage, images, premium, favorite, rating,
    housingType, rooms, guests, price, amenities, authorName, authorEmail, authorAvatar,
    authorPassword, authorType, latitude, longitude] = line.split('\t');

  return {
    title,
    description,
    publicationDate: new Date(date),
    city: city as City,
    previewImage,
    images: images.split(';') as OfferImages,
    isPremium: premium === 'true',
    isFavorite: favorite === 'true',
    rating: Number(rating.replace(',', '.')),
    housingType: housingType as HousingType,
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    amenities: amenities.split(';') as Amenity[],
    author: {
      name: authorName,
      email: authorEmail,
      ...(authorAvatar ? {avatar: authorAvatar} : {}),
      password: authorPassword,
      type: authorType as UserType,
    },
    coordinates: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
  };
}
