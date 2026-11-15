import {randomBytes, scrypt as scryptCallback, timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {inject, injectable} from 'inversify';
import {isValidObjectId, Model} from 'mongoose';
import {Component} from '../types/component.enum.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {UserDocument, UserService} from './user-service.interface.js';

const scrypt = promisify(scryptCallback);

@injectable()
export class MongooseUserService implements UserService {
  constructor(@inject(Component.UserModel) private readonly model: Model<UserEntity>) {}

  public async findById(id: string): Promise<UserDocument | null> {
    return isValidObjectId(id) ? this.model.findById(id).exec() : null;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({email}).exec();
  }

  public async create(user: CreateUserDto): Promise<UserDocument> {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(user.password, salt, 64) as Buffer).toString('hex');
    return this.model.create({...user, password: `${salt}:${hash}`});
  }

  public async verifyCredentials(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const [salt, storedHash] = user.password.split(':');
    if (!salt || !storedHash || !/^[\da-f]+$/i.test(storedHash)) {
      return null;
    }

    const actualHash = await scrypt(password, salt, 64) as Buffer;
    const expectedHash = Buffer.from(storedHash, 'hex');
    return expectedHash.length === actualHash.length && timingSafeEqual(actualHash, expectedHash) ? user : null;
  }
}
