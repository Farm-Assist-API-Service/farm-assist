import { Injectable } from '@nestjs/common';

import { SetRegionService } from './interfaces/providers-interface';

import { RegionProviders } from './enums/region-providers.enum';
import { RestcountriesService } from './providers/restcountries.providers';

/**
 * Factory class responsible for returning a collection of Region API provider classes
 */
@Injectable()
export class RegionProviderFactory {
  repositories: Map<RegionProviders, SetRegionService>;

  constructor(restcountriesService: RestcountriesService) {
    if (!this.repositories) {
      this.repositories = new Map<RegionProviders, SetRegionService>();

      this.repositories.set(
        RegionProviders.Restcountries,
        restcountriesService,
      );
    }
  }

  /**
   * Returns all providers in a map
   */
  public all(): Map<RegionProviders, SetRegionService> {
    return this.repositories;
  }

  /**
   * Returns a single provider
   */
  public findOne(providerName: RegionProviders): SetRegionService {
    const provider = this.repositories.get(providerName);

    if (!provider) {
      throw new ReferenceError(
        'Sorry. Region API provider not found in factory',
      );
    }

    return provider;
  }
}
