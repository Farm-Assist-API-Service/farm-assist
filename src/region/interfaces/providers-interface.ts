export type CurrencyType = {
  name: string;
  code: string;
  symbol: string;
};

export type RegionType = {
  name: string;
  code: string;
  flagSvg?: string;
  flagPng?: string;
  demonym: string;
};

export type RegionInfoType = { currency: CurrencyType; region: RegionType };

export interface SetRegionService {
  getRegion(name: string): Promise<RegionInfoType>;
}
