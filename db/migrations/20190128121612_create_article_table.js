exports.up = function (connection, Promise) {
  //  console.log('creating article table...');
  return connection.schema.createTable('articles', (articleTable) => {
    articleTable.increments('article_id').primary();
    articleTable.string('title');
    articleTable.string('body', 2000);
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topics.slug');
    articleTable.string('username').references('users.username');
    articleTable.timestamp('created_at').defaultTo(connection.fn.now());
  });
};

exports.down = function (connection, Promise) {
  //  console.log('dropping article table...');
  return connection.schema.dropTable('articles');
};
