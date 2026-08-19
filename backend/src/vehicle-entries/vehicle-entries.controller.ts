import { Body, Controller, Post } from '@nestjs/common';
import { CreateVehicleEntryDto } from './dto/create-vehicle-entry.dto';
import { VehicleEntriesService } from './vehicle-entries.services';

@Controller('vehicle-entries')
export class VehicleEntriesController {
  constructor(private readonly vehicleEntriesService: VehicleEntriesService) {}

  @Post()
  create(@Body() createVehicleEntryDto: CreateVehicleEntryDto) {
    return this.vehicleEntriesService.create(createVehicleEntryDto);
  }
}
