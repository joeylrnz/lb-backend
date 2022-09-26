import crypto from 'crypto';

import { db } from 'src/db/knex';
import { convertFromKgToUnit, convertUnitToKg } from 'src/helpers/unitconversion';
import { OrganizationService } from 'src/services/organization';
import {
  IUpsertShipmentOpts,
  INode,
  IGetShipmentOpts,
  IShipment,
  IGetWeightOpts
} from 'src/services/shipment/interfaces';
export class ShipmentService {
  static async upsertShipment(opts: IUpsertShipmentOpts): Promise<void> {
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
    await db('Node').insert(opts.transportPacks.nodes.map((node: INode) => {
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

  static async getShipment(opts: IGetShipmentOpts): Promise<IShipment | undefined> {
    const shipment = await db('Shipment')
      .select('reference_id', 'estimated_time_arrival')
      .where('reference_id', opts.referenceId)
      .first();

    if (!shipment) {
      return;
    }

    const organizations = await db('ShipmentOrganization as so')
      .innerJoin('Organization as o', 'o.id', '=', 'so.organization_id')
      .where('so.shipment_id', shipment.reference_id)
      .select('o.id as id', 'o.code as code');

    const nodes = await db('ShipmentTransportPacks as stp')
      .innerJoin('Node as n', 'n.id', '=', 'stp.node_id')
      .where('stp.shipment_id', shipment.reference_id)
      .select('n.weight as weight', 'n.unit as unit');

    return {
      type: 'SHIPMENT',
      referenceId: shipment.referenceId,
      organizations: organizations.map(org => {
        return {
          type: 'ORGANIZATION',
          id: org.id,
          code: org.code
        };
      }),
      estimatedTimeArrival: shipment.estimated_time_arrival,
      transportPacks: {
        nodes: nodes.map((node) => {
          return {
            totalWeight: {
              weight: node.weight,
              unit: node.unit
            }
          };
        })
      }
    };
  }

  static async getTotalWeight(opts: IGetWeightOpts): Promise<number> {
    /**
     * We'll put all weights to International System's KG
     * and then transform to the unit asked by the user
     */
    
    const nodes = await db('Node')
      .select('weight', 'unit');

    let totalKg = 0;
    for (const node of nodes) {
      if (node.unit !== 'KILOGRAMS') {
        totalKg += convertUnitToKg(node.weight, node.unit);
      } else {
        totalKg += node.weight;
      }
    }

    if (opts.unit !== 'KILOGRAMS') {
      return convertFromKgToUnit(totalKg, opts.unit);
    }

    return totalKg;
  }
}
