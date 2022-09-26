import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await trx.schema.createTable('Shipment', (table) => {
      table.string('reference_id').primary().notNullable();
      table.timestamp('estimated_time_arrival');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    });

    await trx.schema.createTable('Organization', (table) => {
      table.uuid('id').primary();
      table.string('code').notNullable().unique();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    });

    await trx.schema.createTable('ShipmentOrganization', (table) => {
      table.string('shipment_id').notNullable();
      table.uuid('organization_id').notNullable();
      table.string('role');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('deleted_at');

      table.primary(['shipment_id', 'organization_id']);
      table.foreign('shipment_id').references('reference_id').inTable('Shipment');
      table.foreign('organization_id').references('id').inTable('Organization');
    });

    await trx.schema.createTable('Node', (table) => {
      table.uuid('id').primary();
      table.string('weight').notNullable();
      table.string('unit').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    });

    await trx.schema.createTable('ShipmentTransportPacks', (table) => {
      table.string('shipment_id').notNullable();
      table.uuid('node_id').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('deleted_at');

      table.primary(['shipment_id', 'node_id']);
      table.foreign('shipment_id').references('reference_id').inTable('Shipment');
      table.foreign('node_id').references('id').inTable('Node');
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await trx.schema.alterTable('ShipmentTransportPacks', (table) => {
      table.dropForeign('shipment_id');
      table.dropForeign('node_id');
    });
    await trx.schema.dropTable('ShipmentTransportPacks');
    await trx.schema.dropTable('Node');
    await trx.schema.alterTable('ShipmentOrganization', (table) => {
      table.dropForeign('shipment_id');
      table.dropForeign('organization_id');
    });
    await trx.schema.dropTable('Shipment');
    await trx.schema.dropTable('Organization');
  });
}
