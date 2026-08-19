import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { JsonDatabaseService } from '../common/data/json-database.service';

@Module({
  controllers: [SlotsController],
  providers: [SlotsService, JsonDatabaseService],
})
export class SlotsModule {}
