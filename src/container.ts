import {Container} from 'inversify';
import {Model} from 'mongoose';
import {Application} from './app/application.js';
import {CommentEntity, CommentModel} from './comments/comment.model.js';
import {CommentService} from './comments/comment-service.interface.js';
import {MongooseCommentService} from './comments/mongoose-comment-service.js';
import {Config} from './config/config.interface.js';
import {ConvictConfig} from './config/convict.config.js';
import {DatabaseClient} from './database/database-client.interface.js';
import {MongooseDatabaseClient} from './database/mongoose-database-client.js';
import {FavoriteEntity, FavoriteModel} from './favorites/favorite.model.js';
import {FavoriteService} from './favorites/favorite-service.interface.js';
import {MongooseFavoriteService} from './favorites/mongoose-favorite-service.js';
import {Logger} from './logger/logger.interface.js';
import {PinoLogger} from './logger/pino.logger.js';
import {OfferImporter} from './offers/import-offers.js';
import {OfferEntity, OfferModel} from './offers/offer.model.js';
import {OfferService} from './offers/offer-service.interface.js';
import {MongooseOfferService} from './offers/mongoose-offer-service.js';
import {Component} from './types/component.enum.js';
import {MongooseUserService} from './user/mongoose-user-service.js';
import {UserEntity} from './user/user.entity.js';
import {UserModel} from './user/user.model.js';
import {UserService} from './user/user-service.interface.js';

export function createContainer(): Container {
  const container = new Container();

  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config>(Component.Config).to(ConvictConfig).inSingletonScope();
  container.bind<Application>(Component.Application).to(Application).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongooseDatabaseClient).inSingletonScope();
  container.bind<Model<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<Model<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<Model<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<Model<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);
  container.bind<UserService>(Component.UserService).to(MongooseUserService).inSingletonScope();
  container.bind<OfferService>(Component.OfferService).to(MongooseOfferService).inSingletonScope();
  container.bind<CommentService>(Component.CommentService).to(MongooseCommentService).inSingletonScope();
  container.bind<FavoriteService>(Component.FavoriteService).to(MongooseFavoriteService).inSingletonScope();
  container.bind<OfferImporter>(Component.OfferImporter).to(OfferImporter);

  return container;
}
