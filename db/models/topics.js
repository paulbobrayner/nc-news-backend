const connection = require('../connection');

exports.fetchTopics = () => connection.select('*').from('topics');

exports.updateTopic = (topic) => {
  return connection
    .insert(topic)
    .into('topics')
    .returning('*');
};
