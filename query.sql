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

-- SELECT topic, COUNT(topic) AS total_count
-- FROM articles
-- RIGHT JOIN topics ON topics.slug = articles.topic
-- WHERE articles.topic = 'mitch'
-- GROUP BY topic;
-- SELECT title FROM articles WHERE articles.topic = 'mitch' ORDER BY title ASC;

-- SELECT username, title FROM articles WHERE articles.topic = 'mitch' 
-- ORDER BY created_at DESC LIMIT 4 OFFSET 4;

-- SELECT articles.title,
-- COUNT(comments.article_id) AS comment_count
-- FROM articles
-- --  ORDER BY articles.created_at DESC
--  LEFT JOIN comments ON articles.article_id = comments.article_id
--  GROUP BY articles.article_id;

-- SELECT username, created_at, username FROM articles
-- ORDER BY title ASC
-- LIMIT 2 OFFSET 4;

-- SELECT title, article_id, votes, username FROM articles


-- SELECT comments.votes, comments.username
-- FROM comments
-- LEFT JOIN articles
-- ON articles.article_id =comments.article_id
-- WHERE articles.article_id = 1 AND comments.comment_id = 2
-- ORDER BY comments.created_at DESC
-- ;

SELECT users.username, articles.title, articles.article_id  FROM users
JOIN articles
ON articles.username = users.username
WHERE users.username = 'butter_bridge'
ORDER BY articles.created_at DESC;