import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import 'reflect-metadata';
import mongoose from 'mongoose';
import {createContainer} from '../dist/container.js';
import {parseOffer} from '../dist/offers/parse-offer.js';
import {Component} from '../dist/types/component.enum.js';

test('database services calculate offer statistics and isolate favorites', async () => {
  const uri = `mongodb://127.0.0.1:27017/six-cities-service-test-${Date.now()}`;
  const container = createContainer();
  const database = container.get(Component.DatabaseClient);
  const users = container.get(Component.UserService);
  const offers = container.get(Component.OfferService);
  const comments = container.get(Component.CommentService);
  const favorites = container.get(Component.FavoriteService);

  await database.connect(uri);
  try {
    const sample = parseOffer(readFileSync('mocks/offers.tsv', 'utf8').split('\n')[0]);
    const owner = await users.create(sample.author);
    const other = await users.create({...sample.author, email: 'other@example.com'});
    assert.equal((await users.verifyCredentials(owner.email, sample.author.password))?._id.toString(), owner._id.toString());
    assert.equal(await users.verifyCredentials(owner.email, 'wrong-password'), null);

    const fields = {...sample};
    delete fields.author;
    delete fields.rating;
    delete fields.isFavorite;
    const offer = await offers.create({...fields, author: owner._id});
    const laterOffer = await offers.create({
      ...fields,
      title: 'Later non-premium offer',
      publicationDate: new Date(sample.publicationDate.getTime() + 1000),
      isPremium: false,
      author: owner._id
    });

    assert.equal(offer.rating, 0);
    assert.equal(offer.commentCount, 0);
    assert.equal((await offers.findMany(1))[0].id, laterOffer.id);
    assert.equal((await offers.findPremiumByCity(sample.city)).length, 1);
    assert.equal((await offers.findById(offer.id)).author.name, owner.name);

    await comments.create({offer: offer._id, author: other._id, text: 'Excellent stay', rating: 5});
    assert.equal((await offers.findById(offer.id)).rating, 5);
    await comments.create({offer: offer._id, author: owner._id, text: 'Good stay', rating: 4});
    const rated = await offers.findById(offer.id);
    assert.equal(rated.commentCount, 2);
    assert.equal(rated.rating, 4.5);
    assert.equal((await comments.findByOfferId(offer.id)).length, 2);

    await favorites.add({user: owner._id, offer: offer._id});
    await favorites.add({user: owner._id, offer: offer._id});
    assert.equal((await favorites.findByUserId(owner.id)).length, 1);
    assert.equal((await favorites.findByUserId(other.id)).length, 0);
    assert.equal(await favorites.exists(owner.id, offer.id), true);

    assert.equal(await offers.updateById(offer.id, other.id, {title: 'Changed by someone else'}), null);
    assert.equal((await offers.updateById(offer.id, owner.id, {title: 'Updated by owner'})).title, 'Updated by owner');
    assert.equal(await offers.deleteById(offer.id, other.id), false);
    assert.equal(await offers.deleteById(offer.id, owner.id), true);
    assert.equal(await offers.findById(offer.id), null);
    assert.equal((await comments.findByOfferId(offer.id)).length, 0);
    assert.equal(await favorites.exists(owner.id, offer.id), false);
  } finally {
    await mongoose.connection.dropDatabase();
    await database.disconnect();
  }
});
