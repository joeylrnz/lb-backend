import express from 'express';
import { validationResult } from 'express-validator';

import { OrganizationService } from 'src/services/organization';
import { ShipmentService } from 'src/services/shipment';
import { INode } from 'src/services/shipment/interfaces';

import {
  createOrganizationValidation,
  createShipmentValidation,
  getShipmentValidation,
  getOrganizationValidation,
  getWeightValidation
} from './validations';

export async function startHTTPS(): Promise<any> {
  const app = express();

  // Body parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = 3001;

  app.post('/shipment', ...createShipmentValidation, async (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await ShipmentService.upsertShipment({
        referenceId: req.body.referenceId,
        organizations: req.body.organizations,
        estimatedTimeArrival: req.body.estimatedTimeArrival,
        transportPacks: {
          nodes: req.body.transportPacks.nodes as INode[]
        }
      });
    } catch (e: any) {
      res.status(400).json(e.message);
      next();
    }

    res.sendStatus(204);
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
      return res.status(500).json(e.message);
    }

    res.sendStatus(204);
  });

  app.get('/shipments/:referenceId', ...getShipmentValidation, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let response;
    try {
      response = await ShipmentService.getShipment({
        referenceId: req.params.referenceId
      });
    } catch (e: any) {
      return res.sendStatus(500);
    }

    if (!response) {
      return res.status(400).json('Bad request: ID not found');
    }

    res.status(200).json(response);
  });

  app.get('/organizations/:id', ...getOrganizationValidation, async (req: any, res: any) => {
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
      return res.status(500).json(e.message);
    }

    if (!response) {
      return res.status(400).json('Bad request: ID not found');
    }

    res.status(200).json(response);
  });

  app.get('/shipments/weight/:unit', ...getWeightValidation, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let response;
    try {
      response = await ShipmentService.getTotalWeight({
        unit: req.params.unit
      });
    } catch (e: any) {
      return res.status(500).json(e);
    }

    res.status(200).json({
      totalWeight: response,
      unit: req.params.unit
    });
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