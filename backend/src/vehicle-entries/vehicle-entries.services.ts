import { Injectable } from '@nestjs/common';
import { CreateVehicleEntryDto } from './dto/create-vehicle-entry.dto';
import { JsonDatabaseService } from '../common/data/json-database.service';

@Injectable()
export class VehicleEntriesService {
  constructor(private readonly jsonDatabaseService: JsonDatabaseService) {}

  async create(createVehicleEntryDto: CreateVehicleEntryDto) {
    const database = await this.jsonDatabaseService.read();

    const newVehicleEntry = {
      id: database.vehicleEntries.length + 1,
      ...createVehicleEntryDto,
    };

    database.vehicleEntries.push(newVehicleEntry);

    await this.jsonDatabaseService.write(database);

    return newVehicleEntry;
  }
}
