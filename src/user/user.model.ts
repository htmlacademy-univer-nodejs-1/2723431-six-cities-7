import {model, Schema} from 'mongoose';
import {UserEntity} from './user.entity.js';

const userSchema = new Schema<UserEntity>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  avatar: {type: String},
  password: {type: String, required: true},
  type: {type: String, required: true}
}, {timestamps: true, collection: 'users'});

export const UserModel = model<UserEntity>('User', userSchema);
