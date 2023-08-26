import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { FsService } from './services/fs.service';
import { GeneratorService } from './services/generator.service';

@Module({
  providers: [GeneratorService, ConfigService, FsService],
  exports: [GeneratorService, FsService],
})
export class FileModule {}
