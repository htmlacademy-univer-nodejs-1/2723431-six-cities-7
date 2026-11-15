import {FavoriteEntity} from '../favorite.model.js';

export type CreateFavoriteDto = Omit<FavoriteEntity, 'createdAt' | 'updatedAt'>;
