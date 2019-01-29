exports.up = function(connection, Promise) {
  console.log('creating comments table...');
  return connection.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('username').references('users.username');
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at').defaultTo(connection.fn.now());
    commentsTable.string('body', 2000);
  });
};

exports.down = function(connection, Promise) {
  console.log('removing comments table');
  return connection.schema.dropTable('comments');
};
