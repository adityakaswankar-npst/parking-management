import { Module } from '@nestjs/common';
import { SlotsModule } from './slots/slots.module';
import { VehicleEntriesModule } from './vehicle-entries/vehicle-entries.module';

@Module({
  imports: [SlotsModule, VehicleEntriesModule],
})
export class AppModule {}
