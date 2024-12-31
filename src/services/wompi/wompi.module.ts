import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WompiService } from './wompi.service';
import { WompiController } from './wompi.controller';
import { RepositoryModule } from 'src/repositories/repository.module';
@Module({
  imports: [HttpModule, RepositoryModule],
  providers: [WompiService],
  exports: [WompiService],
  controllers: [WompiController],
})
export class WompiModule {}
