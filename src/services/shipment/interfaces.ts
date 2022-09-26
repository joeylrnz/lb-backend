export interface Node {
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
    nodes: Node[]
  }
}
