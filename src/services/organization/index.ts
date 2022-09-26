import { db } from 'src/db/knex';

import { IGetOrganization, IGetOrganizationResponse, IUpsertOrganization } from './interfaces';
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
    return db('Organization')
      .select('id', 'code')
      .where('id', opts.id)
      .first();
  }

  static async getOrganizationIdByCode(codes: string[]): Promise<string[]> {
    return db('Organization')
      .select('id')
      .whereIn('code', codes);
  }
}
