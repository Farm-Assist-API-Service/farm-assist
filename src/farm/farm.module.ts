import { Module } from '@nestjs/common';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { CategoryModule } from './category/category.module';

@Module({
  controllers: [FarmController],
  providers: [FarmService],
  imports: [CategoryModule],
  exports: [CategoryModule],
})
export class FarmModule {}
