import {inject, injectable} from 'inversify';
import {isValidObjectId, Model} from 'mongoose';
import {OfferEntity} from '../offers/offer.model.js';
import {Component} from '../types/component.enum.js';
import {CommentDocument, CommentService} from './comment-service.interface.js';
import {CommentEntity} from './comment.model.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

@injectable()
export class MongooseCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly comments: Model<CommentEntity>,
    @inject(Component.OfferModel) private readonly offers: Model<OfferEntity>
  ) {}

  public async findByOfferId(offerId: string): Promise<CommentDocument[]> {
    if (!isValidObjectId(offerId)) {
      return [];
    }
    return this.comments.find({offer: offerId})
      .sort({publicationDate: -1})
      .limit(50)
      .populate('author', 'name email avatar type')
      .exec();
  }

  public async create(dto: CreateCommentDto): Promise<CommentDocument> {
    const exists = await this.offers.exists({_id: dto.offer});
    if (!exists) {
      throw new Error('Предложение не найдено');
    }

    const comment = await this.comments.create({...dto, publicationDate: new Date()});
    const count = {$add: [{$ifNull: ['$commentCount', 0]}, 1]};
    const sum = {$add: [{$ifNull: ['$ratingSum', 0]}, dto.rating]};

    const result = await this.offers.updateOne({_id: dto.offer}, [{$set: {
      commentCount: count,
      ratingSum: sum,
      rating: {$round: [{$divide: [sum, count]}, 1]}
    }}]);

    if (result.matchedCount === 0) {
      await comment.deleteOne();
      throw new Error('Предложение не найдено');
    }

    return comment;
  }
}
