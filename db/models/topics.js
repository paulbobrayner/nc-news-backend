const connection = require('../connection');

exports.fetchTopics = () => connection.select('*').from('topics');

exports.updateTopic = topic => connection
  .insert(topic)
  .into('topics')
  .returning('*');

exports.fetchArticlesFromTopic = ({ topic }, { limit = 10 }) => connection
  .select(
    'articles.username as author',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
  )
  .count({ comment_count: 'comments.article_id' })
  .from('articles')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id')
  .limit(limit)
  .orderBy('created_at', 'desc')
  .where('articles.topic', '=', topic);

exports.getTotalCount = ({ topic }) => connection
  .select('topic')
  .count({ total_count: 'topic' })
  .from('articles')
  .rightJoin('topics', 'topics.slug', '=', 'articles.topic')
  .groupBy('topic')
  .where('articles.topic', '=', topic);
