import { body, param } from 'express-validator';

export const createShipmentValidation = [
  body('type').isString().custom((value) => {
    if (value !== 'SHIPMENT') {
      return Promise.reject('type must be SHIPMENT');
    }
    return true;
  }),
  body('referenceId').isString(),
  body('organizations').isArray(),
  body('transportPacks').isObject(),
  body('transportPacks.nodes').isArray(),
  body('estimatedTimeArrival').isString().optional()
];

export const getOrganizationValidation = [
  param('id').isUUID()
];

export const getShipmentValidation = [
  param('referenceId').isString()
];

export const createOrganizationValidation = [
  body('type').isString().custom((value) => {
    if (value !== 'ORGANIZATION') {
      return Promise.reject('type must be ORGANIZATION');
    }
    return true;
  }),
  body('id').isUUID(),
  body('code').isString()
];
