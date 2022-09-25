import express from 'express';
import { validationResult } from 'express-validator';

import { createOrganizationValidation, createShipmentValidation, getValidation } from './validations';

export async function startHTTPS(): Promise<any> {
  const app = express();

  // Body parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = 3001;

  app.post('/shipment', ...createShipmentValidation, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('/shipment');

    res.status(200).json('OK');
  });

  app.post('/organization', ...createOrganizationValidation, (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('/organization');

    res.status(200).json('OK');
  });

  app.get('/shipments/:referenceId', ...getValidation, (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('/shipments/referenceid');

    res.status(200).json('OK');
  });

  app.get('/organizations/:id', ...getValidation, (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('/organizations/referenceid');

    res.status(200).json('OK');
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