const {
  userData,
  topicData,
  articleData,
  commentData,
} = require('../data/development-data');

const { getTime, articleRef, formatComments } = require('../utils/index');

exports.seed = function(connection, Promise) {
  return connection
    .insert(userData)
    .into('users')
    .then(() => {
      return connection
        .insert(topicData)
        .into('topics')
        .returning('*');
    })
    .then(() => {
      const adjustTime = getTime(articleData);
      return connection
        .insert(adjustTime)
        .into('articles')
        .returning('*');
    })
    .then(() => {
      const ref = articleRef(commentData);
      const adjustComments = formatComments(ref, commentData);
      return connection
        .insert(adjustComments)
        .into('comments')
        .returning('*');
    });
};
