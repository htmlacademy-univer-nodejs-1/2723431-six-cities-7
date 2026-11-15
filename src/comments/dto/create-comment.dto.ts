import {Types} from 'mongoose';
import {Comment} from '../../types/comment.type.js';

export type CreateCommentDto = Pick<Comment, 'text' | 'rating'> & {
  author: Types.ObjectId;
  offer: Types.ObjectId;
};
