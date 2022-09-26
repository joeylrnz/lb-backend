import { db } from 'src/db/knex';

import { IGetOrganization, IGetOrganizationResponse, IUpsertOrganization } from 'src/services/organization/interfaces';

export class OrganizationService {
  static async upsertOrganization(opts: IUpsertOrganization): Promise<number[]> {
    const timestamp = (new Date()).toISOString();
    return db('Organization')
      .insert({
        id: opts.id,
        code: opts.code,
        created_at: timestamp,
        updated_at: timestamp
      })
      .onConflict('id')
      .merge({
        code: opts.code,
        updated_at: timestamp
      });
  }

  static async getOrganization(opts: IGetOrganization): Promise<IGetOrganizationResponse | undefined> {
    const organization = await db('Organization')
      .select('id', 'code')
      .where('id', opts.id)
      .first();
    
    return {
      type: 'ORGANIZATION',
      id: organization.id,
      code: organization.code
    };
  }

  static async getOrganizationIdByCode(codes: string[]): Promise<string[]> {
    const response = await db('Organization')
      .select('id')
      .whereIn('code', codes);

    return response.map(res => res.id);
  }
}
