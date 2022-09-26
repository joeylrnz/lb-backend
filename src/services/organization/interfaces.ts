export interface IUpsertOrganization {
  id: string;
  code: string;
}

export interface IGetOrganization {
  id: string;
}

export interface IGetOrganizationResponse {
  type: string;
  id: string;
  code: string;
}

export interface IOrganization {
  type: string;
  id: string;
  code: string;
}
