import { Module } from '@nestjs/common';
import { VehicleEntriesService } from './vehicle-entries.services';
import { VehicleEntriesController } from './vehicle-entries.controller';
import { JsonDatabaseService } from '../common/data/json-database.service';

@Module({
  controllers: [VehicleEntriesController],
  providers: [VehicleEntriesService, JsonDatabaseService],
})
export class VehicleEntriesModule {}
