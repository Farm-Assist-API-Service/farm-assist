import { HttpStatus, Logger } from '@nestjs/common';
import { axios } from 'src/utils/helpers/axios';
import {
  RegionInfoType,
  SetRegionService,
} from '../interfaces/providers-interface';

export class RestcountriesService implements SetRegionService {
  private logger: Logger;
  private baseURl: string;

  constructor() {
    this.logger = new Logger(RestcountriesService.name);
    this.baseURl = 'https://restcountries.com/v3.1/';
  }
  async getRegion(name: string): Promise<RegionInfoType> {
    try {
      const response: RegionInfoType = {
        currency: {
          name: '',
          code: '',
          symbol: '',
        },
        region: {
          name: '',
          code: '',
          flagSvg: '',
          flagPng: '',
          demonym: '',
        },
      };

      const { data } = await axios({
        baseURL: this.baseURl,
      }).get(`name/${name}`);

      if (data && Array.isArray(data)) {
        const [{ name, cca2, currencies, demonyms, flags }] = data;

        const [currInfo]: any = Object.values(currencies);
        const [currCode]: any = Object.keys(currencies);

        response.region.name = name?.common;
        response.region.demonym = demonyms?.eng?.m;
        response.region.flagPng = flags?.png;
        response.region.flagSvg = flags?.svg;
        response.region.code = cca2;

        response.currency.name = currInfo?.name;
        response.currency.code = currCode;
        response.currency.symbol = currInfo?.symbol;
      }

      return response;
    } catch (error) {
      this.logger.error(`Restcountries Error: ${JSON.stringify(error)}`);
      if (
        error?.response?.status &&
        error?.response?.status === HttpStatus.NOT_FOUND
      ) {
        throw new Error(error?.response?.statusText);
      }
      throw new Error(
        `Restcountries Error: Something went wrong ====> ${JSON.stringify(
          error,
        )}`,
      );
    }
  }
}
