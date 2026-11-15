import {User} from '../types/user.type.js';

export type UserEntity = User & {
  createdAt?: Date;
  updatedAt?: Date;
};
