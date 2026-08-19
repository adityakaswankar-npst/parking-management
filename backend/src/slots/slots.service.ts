import { ConflictException, Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../common/data/json-database.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { Slot } from './slot.interface';

@Injectable()
export class SlotsService {
  constructor(
    private readonly jsonDatabaseService: JsonDatabaseService,
  ) {}

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
}
