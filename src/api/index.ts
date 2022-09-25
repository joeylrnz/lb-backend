import express from 'express';
import { validationResult } from 'express-validator';

import { OrganizationService } from 'src/services/organization';

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

  app.post('/organization', ...createOrganizationValidation, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await OrganizationService.upsertOrganization({
        id: req.body.id,
        code: req.body.code
      });
    } catch (e: any) {
      return res.sendStatus(500);
    }

    res.status(200).json({
      id: req.body.id,
      code: req.body.code
    });
  });

  app.get('/shipments/:referenceId', ...getValidation, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let response;
    try {
      response = await OrganizationService.getOrganization({
        id: req.body.id
      });
    } catch (e: any) {
      return res.sendStatus(500);
    }

    if (!response) {
      return res.status(400).string('Bad request: ID not found');
    }

    res.status(200).json(response);
  });

  app.get('/organizations/:id', ...getValidation, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let response;
    try {
      response = await OrganizationService.getOrganization({
        id: req.params.id
      });
    } catch (e: any) {
      return res.status(500).json(e);
    }

    if (!response) {
      return res.status(400).string('Bad request: ID not found');
    }

    res.status(200).json(response);
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