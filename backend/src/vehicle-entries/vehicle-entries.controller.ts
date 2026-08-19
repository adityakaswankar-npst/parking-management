import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateVehicleEntryDto } from './dto/create-vehicle-entry.dto';
import { VehicleEntriesService } from './vehicle-entries.services';

@Controller('vehicle-entries')
export class VehicleEntriesController {
  constructor(private readonly vehicleEntriesService: VehicleEntriesService) {}

  @Get()
  findAll() {
    return this.vehicleEntriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleEntriesService.findOne(Number(id));
  }

  @Post()
  create(@Body() createVehicleEntryDto: CreateVehicleEntryDto) {
    return this.vehicleEntriesService.create(createVehicleEntryDto);
  }

  @Put(':id/exit')
  exit(@Param('id') id: string) {
    return this.vehicleEntriesService.exit(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleEntriesService.remove(Number(id));
  }
}
