import {HydratedDocument} from 'mongoose';
import {CommentEntity} from './comment.model.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

export type CommentDocument = HydratedDocument<CommentEntity>;

export interface CommentService {
  findByOfferId(offerId: string): Promise<CommentDocument[]>;
  create(dto: CreateCommentDto): Promise<CommentDocument>;
}
