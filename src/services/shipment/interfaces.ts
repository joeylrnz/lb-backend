import { IOrganization } from '../organization/interfaces';

export interface INode {
  totalWeight: {
    weight: string;
    unit: string;
  }
}

export interface IUpsertShipmentOpts {
  referenceId: string;
  organizations: string[];
  estimatedTimeArrival?: string;
  transportPacks: {
    nodes: INode[]
  }
}

export interface IShipment {
  type: string;
  referenceId: string;
  organizations: IOrganization[];
  estimatedTimeArrival?: string;
  transportPacks: {
    nodes: INode[]
  }
}

export interface IGetShipmentOpts {
  referenceId: string;
}

export interface IGetWeightOpts {
  unit: string;
}
