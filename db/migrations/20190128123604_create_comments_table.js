exports.up = function(connection, Promise) {
  console.log('creating comments table...');
  return connection.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('username').references('users.username');
    commentsTable.integer('article_id').references('article.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.string('created_at').defaultTo(Date.now());
    commentsTable.string('body');
  });
};

exports.down = function(connection, Promise) {
  console.log('removing comments table');
  return connection.schema.dropTable('comments');
};
