import { FarmCategory } from '../entities/category.entity';

export type Category = Partial<FarmCategory> & {
  subCategories: FarmCategory[];
};
