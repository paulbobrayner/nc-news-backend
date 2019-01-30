\c nc_knews_test

-- SELECT topic,  COUNT(topic) AS total_count FROM articles
--  JOIN topics ON topics.slug = articles.topic  GROUP BY topic;

--username AS author, title, article_id, votes, created_at, topic

--SELECT articles.title,
--COUNT(comments.article_id) AS comment_count
--FROM articles
 --JOIN comments ON articles.article_id = comments.article_id
 --GROUP BY articles.article_id
--;

SELECT topic, COUNT(topic) AS total_count
FROM articles
RIGHT JOIN topics ON topics.slug = articles.topic
WHERE articles.topic = 'mitch'
GROUP BY topic;


