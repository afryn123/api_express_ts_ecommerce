const {
  DB_USERNAME = 'postgres',
  DB_PASSWORD = 'iyan007',
  DB_HOST = 'localhost',
  DB_NAME = 'Testing2',
  DB_PORT = 5432,
  DB_DIALECT = 'postgres'
} = process.env

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}_development`,
    port: DB_PORT,
    host: DB_HOST,
    dialect: DB_DIALECT
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}_test`,
    port: DB_PORT,
    host: DB_HOST,
    dialect: DB_DIALECT
  },
  production: {
    url: 'postgres://codqvunoeismyy:0fb6eaf5ed6fe27aa6445435aa30935d0d421f90a02650d7c03e9876477ed612@ec2-3-219-229-143.compute-1.amazonaws.com:5432/d61f8rojtlm9su',
    username: 'codqvunoeismyy',
    password: '0fb6eaf5ed6fe27aa6445435aa30935d0d421f90a02650d7c03e9876477ed612',
    database: 'd61f8rojtlm9su',
    host: 'ec2-3-219-229-143.compute-1.amazonaws.com',
    port: 5432,
    dialect: DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
