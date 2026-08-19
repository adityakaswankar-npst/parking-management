import { Module } from '@nestjs/common';
import { VehicleEntriesService } from './vehicle-entries.services';

@Module({
  providers: [VehicleEntriesService],
})
export class VehicleEntriesModule {}
