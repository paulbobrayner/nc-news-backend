const connection = require('../connection');

exports.fetchTopics = () => connection.select('*').from('topics');

exports.postTopic = topic => connection
  .insert(topic)
  .into('topics')
  .returning('*');

exports.fetchArticlesFromTopic = (
  { topic },
  {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
  },
) => connection
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
  .offset((p - 1) * limit)
  .orderBy(sort_by, order)
  .where('articles.topic', '=', topic);

exports.getTotalCount = ({ topic }) => connection
  .select('topic')
  .count({ total_count: 'topic' })
  .from('articles')
  .rightJoin('topics', 'topics.slug', '=', 'articles.topic')
  .groupBy('topic')
  .where('articles.topic', '=', topic);

exports.postArticle = (article, { topic }) => {
  // console.log(article, topic);
  const newArticle = { ...article, topic }; // copy over article and add topic key onto it.
  return connection
    .insert(newArticle)
    .into('articles')
    .returning('*');
};
