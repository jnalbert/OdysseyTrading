export interface PinTypeDB {
  uuid: string;
  worldUuid: string;
  worldName: string;
  name: string;
  description: string;
  src: string;
  isAvailableForOpening: boolean;
}

export interface WorldTypeDB {
  uuid: string;
  worldName: string;
  worldColor: string;
  worldIcon: string;
  numPinsInWorld: number;
}

export interface UserOwnedPinTypeDB {
  pinUuid: string;
  worldUuid: string;
  worldName: string;
  duplicates: number;
}

export enum worldsNamesDB {
  DeepSea = "Deep Sea",
  EnchantedForest = "Enchanted Forest",
  Seasonal = "Seasonal",
}