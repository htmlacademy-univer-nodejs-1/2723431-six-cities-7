import {HydratedDocument} from 'mongoose';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';

export type UserDocument = HydratedDocument<UserEntity>;

export interface UserService {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(dto: CreateUserDto): Promise<UserDocument>;
  verifyCredentials(email: string, password: string): Promise<UserDocument | null>;
}
