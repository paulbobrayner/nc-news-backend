exports.up = function(connection, Promise) {
  console.log('creating article table...');
  return connection.schema.createTable('article', (articleTable) => {
    articleTable.increments('article_id').primary();
    articleTable.string('title');
    articleTable.string('body');
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topic.slug');
    articleTable.string('created_by').references('users.username');
    articleTable.timestamps('created_at', true);
    //  articleTable.timestamps('created_at', true).defaultTo(connection.fn.now());
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping article table...');
  return connection.schema.dropTable('article');
};
