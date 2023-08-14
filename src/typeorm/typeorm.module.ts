import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { typeOrmAysncConfig } from './typeorm.config';
@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmAysncConfig), ConfigModule],
})
export class TypeormModule {}
