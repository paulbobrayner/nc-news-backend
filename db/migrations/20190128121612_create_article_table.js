exports.up = function (connection, Promise) {
  //  console.log('creating article table...');
  return connection.schema.createTable('articles', (articleTable) => {
    articleTable
      .increments('article_id')
      .primary()
      .notNullable();
    articleTable.string('title').notNullable();
    articleTable.string('body', 2000).notNullable();
    articleTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    articleTable
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articleTable
      .string('username')
      .references('users.username')
      .notNullable();
    articleTable.timestamp('created_at').defaultTo(connection.fn.now());
  });
};

exports.down = function (connection, Promise) {
  //  console.log('dropping article table...');
  return connection.schema.dropTable('articles');
};
