import { Knex } from 'knex';
import { parse } from 'pg-connection-string';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: (): Knex.PgConnectionConfig => {
    const dbConfig = parse(process.env.DATABASE_URL || '');

    return {
      host: dbConfig.host || 'localhost',
      port: Number(dbConfig.port) || 5432,
      user: dbConfig.user || 'postgres',
      password: dbConfig.password || '123',
      database: dbConfig.database || 'logixboard_db',
    };
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
    tableName: 'knex_migrations',
  }
};

export default knexConfig;