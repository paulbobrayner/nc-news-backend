const {
  userData,
  topicData,
  articleData,
  commentData,
} = require('../data/development-data');

exports.seed = function(connection, Promise) {
  return connection
    .insert(userData)
    .into('users')
    .then(() => {
      return connection
        .insert(topicData)
        .into('topic')
        .returning('*');
    })
    .then(() => {
      return connection
        .insert(articleData)
        .into('article')
        .returning('*');
    })
    .then(() => {
      return connection
        .insert(commentData)
        .into('comments')
        .returning('*');
    });
};
