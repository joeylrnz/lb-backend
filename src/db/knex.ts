import { config } from 'dotenv';

import { knex, Knex } from 'knex';

import logger from 'src/helpers/winston';

let db: Knex;

config();

const initializeDb = async (): Promise<Knex> => {
  const { default: knexConfig } = await import('../../knexfile');

  // Create knex instance with the right credentials
  db = knex(knexConfig);

  try {
    // Run migrations
    await db.migrate.latest();
    logger.info('Migrations ran successfully');
  } catch (e: any) {
    // Destroy database connection before throwing error
    await db.destroy();

    const message = `Error running migrations. ${e}`;
    logger.error(message, { error: e.message });
    throw new Error(message);
  }

  return db;
};

export { initializeDb, db };
