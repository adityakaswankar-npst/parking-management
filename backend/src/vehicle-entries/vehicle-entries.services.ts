import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleEntryDto } from './dto/create-vehicle-entry.dto';
import { JsonDatabaseService } from '../common/data/json-database.service';
import { VehicleType } from '../common/enums/vehicle-type.enums';

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
      parkingFee: null,
    };

    database.vehicleEntries.push(newVehicleEntry);

    await this.jsonDatabaseService.write(database);

    return newVehicleEntry;
  }

  async exit(id: number) {
    const database = await this.jsonDatabaseService.read();

    const vehicleEntry = database.vehicleEntries.find(
      (vehicleEntry) => vehicleEntry.id === id,
    );

    if (!vehicleEntry) {
      throw new NotFoundException('Vehicle entry not found');
    }

    if (vehicleEntry.exitTime !== null) {
      throw new ConflictException('Vehicle has already exited');
    }

    const exitTime = new Date();
    const entryTime = new Date(vehicleEntry.entryTime);

    const durationInMilliseconds = exitTime.getTime() - entryTime.getTime();

    const thirtyMinutesInMilliseconds = 30 * 60 * 1000;

    const parkingBlocks = Math.ceil(
      durationInMilliseconds / thirtyMinutesInMilliseconds,
    );

    const parkingRate = vehicleEntry.vehicleType === VehicleType.BIKE ? 10 : 20;

    const parkingFee = parkingBlocks * parkingRate;

    vehicleEntry.exitTime = exitTime.toISOString();
    vehicleEntry.parkingFee = parkingFee;

    await this.jsonDatabaseService.write(database);

    return vehicleEntry;
  }

  async remove(id: number) {
    const database = await this.jsonDatabaseService.read();

    const vehicleEntryIndex = database.vehicleEntries.findIndex(
      (vehicleEntry) => vehicleEntry.id === id,
    );

    if (vehicleEntryIndex === -1) {
      throw new NotFoundException('Vehicle entry not found');
    }

    const vehicleEntry = database.vehicleEntries[vehicleEntryIndex];

    if (vehicleEntry.exitTime === null) {
      throw new ConflictException('Active vehicle entry cannot be deleted');
    }

    const [deletedVehicleEntry] = database.vehicleEntries.splice(
      vehicleEntryIndex,
      1,
    );

    await this.jsonDatabaseService.write(database);

    return deletedVehicleEntry;
  }
}
