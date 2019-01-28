exports.up = function(connection, Promise) {
  console.log('creating users table...');
  return connection.schema.createTable('users', (usersTable) => {
    usersTable.string('username').primary();
    usersTable.string('avatar_url');
    usersTable.string('name');
  });
};

exports.down = function(connection, Promise) {
  console.log('removing users tables...');
  return connection.schema.dropTable('users');
};
