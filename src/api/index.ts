import express from 'express';

export async function startHTTPS(): Promise<any> {
  const app = express();

  // Body parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = 3001;

  app.post('/shipment', async (_req: any, _res: any) => {
    console.log('/shipment');
  });

  app.post('/organization', (_req: any, _res: any) => {
    console.log('/organization');
  });

  app.get('/shipments/:referenceId', (_req: any, _res: any) => {
    console.log('/shipments/referenceid');
  });

  app.get('/organizations/:id', (_req: any, _res: any) => {
    console.log('/organizations/referenceid');
  });

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
  });

  return {
    server,
    close: () => {
      return new Promise((resolve) => server.close(resolve));
    },
  };
}