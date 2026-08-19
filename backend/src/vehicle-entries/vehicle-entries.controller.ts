import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVehicleEntryDto } from './dto/create-vehicle-entry.dto';
import { VehicleEntriesService } from './vehicle-entries.services';

@Controller('vehicle-entries')
export class VehicleEntriesController {
  constructor(private readonly vehicleEntriesService: VehicleEntriesService) {}

  @Get()
  findAll() {
    return this.vehicleEntriesService.findAll();
  }
  
  @Post()
  create(@Body() createVehicleEntryDto: CreateVehicleEntryDto) {
    return this.vehicleEntriesService.create(createVehicleEntryDto);
  }
}
