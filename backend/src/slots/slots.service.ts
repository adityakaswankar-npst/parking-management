import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../common/data/json-database.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { Slot } from './slot.interface';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class SlotsService {
  constructor(private readonly jsonDatabaseService: JsonDatabaseService) {}

  async create(createSlotDto: CreateSlotDto): Promise<Slot> {
    const database = await this.jsonDatabaseService.read();

    const slotAlreadyExists = database.slots.some(
      (slot) => slot.slotNumber === createSlotDto.slotNumber,
    );

    if (slotAlreadyExists) {
      throw new ConflictException(
        `Slot ${createSlotDto.slotNumber} already exists`,
      );
    }

    const newSlot: Slot = {
      id: this.getNextId(database.slots),
      slotNumber: createSlotDto.slotNumber,
      vehicleType: createSlotDto.vehicleType,
    };

    database.slots.push(newSlot);

    await this.jsonDatabaseService.write(database);

    return newSlot;
  }

  private getNextId(slots: Slot[]): number {
    if (slots.length === 0) {
      return 1;
    }

    return Math.max(...slots.map((slot) => slot.id)) + 1;
  }

  async update(id: number, updateSlotDto: UpdateSlotDto) {
    const database = await this.jsonDatabaseService.read();

    const slot = database.slots.find((slot) => slot.id === id);

    if (!slot) {
      throw new NotFoundException(`Slot with ${id} not found`);
    }

    const duplicateSlot = database.slots.find(
      (existingSlot) =>
        existingSlot.slotNumber === updateSlotDto.slotNumber &&
        existingSlot.id !== id,
    );

    if (duplicateSlot) {
      throw new ConflictException(
        `Slot number ${updateSlotDto.slotNumber} already exists`,
      );
    }

    slot.slotNumber = updateSlotDto.slotNumber;
    slot.vehicleType = updateSlotDto.vehicleType;

    await this.jsonDatabaseService.write(database);

    return slot;
  }

  async findAll() {
    const database = await this.jsonDatabaseService.read();
    return database.slots;
  }

  async findOne(id: number) {
    const database = await this.jsonDatabaseService.read();

    const slot = database.slots.find((slot) => slot.id === id);
    if (!slot) {
      throw new NotFoundException(`Slot with ${id} not found`);
    }
    return slot;
  }
}
