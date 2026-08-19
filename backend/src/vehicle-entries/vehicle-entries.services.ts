import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleEntryDto } from './dto/create-vehicle-entry.dto';
import { JsonDatabaseService } from '../common/data/json-database.service';

@Injectable()
export class VehicleEntriesService {
  constructor(private readonly jsonDatabaseService: JsonDatabaseService) {}

  async findAll() {
    const database = await this.jsonDatabaseService.read();

    return database.vehicleEntries;
  }

  async findOne(id: number) {
    const database = await this.jsonDatabaseService.read();

    const vehicleEntry = database.vehicleEntries.find(
      (vehicleEntry) => vehicleEntry.id === id,
    );

    if (!vehicleEntry) {
      throw new NotFoundException('Vehicle entry not found');
    }

    return vehicleEntry;
  }

  async create(createVehicleEntryDto: CreateVehicleEntryDto) {
    const database = await this.jsonDatabaseService.read();

    const slot = database.slots.find(
      (slot) => slot.id === createVehicleEntryDto.slotId,
    );

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    const activeEntryForSlot = database.vehicleEntries.find(
      (vehicleEntry) =>
        vehicleEntry.slotId === createVehicleEntryDto.slotId &&
        vehicleEntry.exitTime === null,
    );

    if (activeEntryForSlot) {
      throw new ConflictException('Slot is already occupied');
    }

    if (slot.vehicleType !== createVehicleEntryDto.vehicleType) {
      throw new ConflictException(
        'Vehicle type does not match slot vehicle type',
      );
    }

    const activeEntryForVehicle = database.vehicleEntries.find(
      (vehicleEntry) =>
        vehicleEntry.vehicleNumber === createVehicleEntryDto.vehicleNumber &&
        vehicleEntry.exitTime === null,
    );

    if (activeEntryForVehicle) {
      throw new ConflictException('Vehicle is already actively parked');
    }

    const newVehicleEntry = {
      id: database.vehicleEntries.length + 1,
      vehicleNumber: createVehicleEntryDto.vehicleNumber,
      vehicleType: createVehicleEntryDto.vehicleType,
      entryTime: new Date().toISOString(),
      exitTime: null,
      slotId: createVehicleEntryDto.slotId,
    };

    database.vehicleEntries.push(newVehicleEntry);

    await this.jsonDatabaseService.write(database);

    return newVehicleEntry;
  }
}
