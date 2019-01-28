const {
  articles,
  comments,
  topics,
  users,
} = require('../data/development-data');

exports.seed = (connection, Promise) => {
  return connection('shop_owners')
    .insert(owners)
    .then(() => {
      return connection('shops').insert(shops);
    })
    .then(() => {
      return connection('treasures').insert(treasures);
    });
};
