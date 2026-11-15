import {model, Schema, Types} from 'mongoose';
import {Comment} from '../types/comment.type.js';

export type CommentEntity = Omit<Comment, 'author'> & {
  author: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const commentSchema = new Schema<CommentEntity>({
  text: {type: String, required: true},
  publicationDate: {type: Date, default: Date.now},
  rating: {type: Number, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  offer: {type: Schema.Types.ObjectId, ref: 'Offer', required: true}
}, {timestamps: true, collection: 'comments'});

commentSchema.index({offer: 1, publicationDate: -1});

export const CommentModel = model<CommentEntity>('Comment', commentSchema);
