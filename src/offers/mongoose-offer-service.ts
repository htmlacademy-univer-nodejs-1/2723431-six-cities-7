import {inject, injectable} from 'inversify';
import {isValidObjectId, Model} from 'mongoose';
import {CommentEntity} from '../comments/comment.model.js';
import {FavoriteEntity} from '../favorites/favorite.model.js';
import {Component} from '../types/component.enum.js';
import {City} from '../types/offer.type.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferEntity} from './offer.model.js';
import {OfferDocument, OfferService} from './offer-service.interface.js';

@injectable()
export class MongooseOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly model: Model<OfferEntity>,
    @inject(Component.CommentModel) private readonly comments: Model<CommentEntity>,
    @inject(Component.FavoriteModel) private readonly favorites: Model<FavoriteEntity>
  ) {}

  public async findById(id: string): Promise<OfferDocument | null> {
    return isValidObjectId(id) ? this.model.findById(id).populate('author', 'name email avatar type').exec() : null;
  }

  public async findMany(limit = 60): Promise<OfferDocument[]> {
    return this.model.find().sort({publicationDate: -1}).limit(limit).exec();
  }

  public async findPremiumByCity(city: City): Promise<OfferDocument[]> {
    return this.model.find({city, isPremium: true}).sort({publicationDate: -1}).limit(3).exec();
  }

  public async create(dto: CreateOfferDto): Promise<OfferDocument> {
    return this.model.create({...dto, rating: 0, ratingSum: 0, commentCount: 0});
  }

  public async updateById(id: string, authorId: string, dto: UpdateOfferDto): Promise<OfferDocument | null> {
    if (!isValidObjectId(id) || !isValidObjectId(authorId)) {
      return null;
    }
    return this.model.findOneAndUpdate({_id: id, author: authorId}, dto, {new: true}).exec();
  }

  public async deleteById(id: string, authorId: string): Promise<boolean> {
    if (!isValidObjectId(id) || !isValidObjectId(authorId)) {
      return false;
    }
    const deleted = await this.model.findOneAndDelete({_id: id, author: authorId}).exec();
    if (!deleted) {
      return false;
    }
    await Promise.all([
      this.comments.deleteMany({offer: deleted._id}).exec(),
      this.favorites.deleteMany({offer: deleted._id}).exec()
    ]);
    return true;
  }
}
