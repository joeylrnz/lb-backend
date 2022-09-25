import logger from 'src/helpers/winston';

import { startHTTPS } from './api';

import { initializeDb } from './db/knex';

async function starter() {
  try {
    await initializeDb();
    const { close } = await startHTTPS();
    setupGracefulShutdown(close);
  } catch (err: any) {
    logger.debug(err);
    logger.error('unhandled exceptions received', {
      exception: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

function setupGracefulShutdown(exit: () => Promise<void>) {
  const action = async () => {
    await exit();
    process.exit(0);
  };
  process.on('SIGINT', action);
  process.on('SIGTERM', action);
  process.on('SIGQUIT', action);
  process.on('SIGUSR2', action);
}

void starter();
