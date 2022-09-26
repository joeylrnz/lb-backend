import crypto from 'crypto';

import { db } from 'src/db/knex';

import { OrganizationService } from 'src/services/organization';

import { IUpsertShipmentOpts, Node } from './interfaces';

export class ShipmentService {
  static async upsertShipment(opts: IUpsertShipmentOpts): Promise<IUpsertShipmentResponse> {
    await db('Shipment')
      .insert({
        reference_id: opts.referenceId,
        estimated_time_arrival: opts.estimatedTimeArrival || null,
      })
      .onConflict('reference_id')
      .merge({
        estimated_time_arrival: opts.estimatedTimeArrival || null
      });
    
    /**
     * Shipment-Organization relationship
     * Due to having to upsert, we need to do delete entries that
     * won't exist anymore
     * At last, insert when it doesn't already exist
     */
    const organizationIds = await OrganizationService.getOrganizationIdByCode(opts.organizations);
    if (organizationIds.length < opts.organizations.length) {
      throw new Error('Invalid organization entered');
    }

    await db('ShipmentOrganization')
      .where('shipment_id', opts.referenceId)
      .whereNotIn('organization_id', organizationIds)
      .delete();

    await db('ShipmentOrganization')
      .insert(organizationIds.map(organizationId => {
        return {
          shipment_id: opts.referenceId,
          organization_id: organizationId
        };
      }))
      .onConflict()
      .ignore();

    await db('ShipmentTransportPacks')
      .where({
        shipment_id: opts.referenceId
      })
      .delete();

    const nodeIds: string[] = [];
    await db('Node').insert(opts.transportPacks.nodes.map((node: Node) => {
      const nodeId = crypto.randomUUID();
      nodeIds.push(nodeId);

      return {
        id: nodeId,
        weight: node.totalWeight.weight,
        unit: node.totalWeight.unit
      };
    }));

    await db('ShipmentTransportPacks')
      .insert(nodeIds.map((nodeId: string) => {
        return {
          shipment_id: opts.referenceId,
          node_id: nodeId
        };
      }));
  }
}
