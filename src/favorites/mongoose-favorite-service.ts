import {inject, injectable} from 'inversify';
import {isValidObjectId, Model} from 'mongoose';
import {OfferEntity} from '../offers/offer.model.js';
import {OfferDocument} from '../offers/offer-service.interface.js';
import {Component} from '../types/component.enum.js';
import {FavoriteDocument, FavoriteService} from './favorite-service.interface.js';
import {CreateFavoriteDto} from './dto/create-favorite.dto.js';
import {FavoriteEntity} from './favorite.model.js';

@injectable()
export class MongooseFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel) private readonly favorites: Model<FavoriteEntity>,
    @inject(Component.OfferModel) private readonly offers: Model<OfferEntity>
  ) {}

  public async findByUserId(userId: string): Promise<OfferDocument[]> {
    if (!isValidObjectId(userId)) {
      return [];
    }
    const records = await this.favorites.find({user: userId}).select('offer').lean().exec();
    return this.offers.find({_id: {$in: records.map((record) => record.offer)}})
      .sort({publicationDate: -1})
      .exec();
  }

  public async exists(userId: string, offerId: string): Promise<boolean> {
    if (!isValidObjectId(userId) || !isValidObjectId(offerId)) {
      return false;
    }
    return Boolean(await this.favorites.exists({user: userId, offer: offerId}));
  }

  public async add(dto: CreateFavoriteDto): Promise<FavoriteDocument> {
    if (!await this.offers.exists({_id: dto.offer})) {
      throw new Error('Предложение не найдено');
    }
    return this.favorites.findOneAndUpdate(dto, {$setOnInsert: dto}, {upsert: true, new: true}).orFail().exec();
  }

  public async remove(userId: string, offerId: string): Promise<boolean> {
    if (!isValidObjectId(userId) || !isValidObjectId(offerId)) {
      return false;
    }
    const result = await this.favorites.deleteOne({user: userId, offer: offerId}).exec();
    return result.deletedCount > 0;
  }
}
