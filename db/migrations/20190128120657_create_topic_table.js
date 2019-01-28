exports.up = function(connection, Promise) {
  console.log('creating topic table...');
  return connection.schema.createTable('topic', (topicTable) => {
    topicTable.string('slug').primary();
    topicTable.string('description');
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping topic table...');
  return connection.schema.dropTable('topic');
};
