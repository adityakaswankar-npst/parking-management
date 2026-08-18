import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Slot } from '../../slots/slot.interface';
import { VehicleEntry } from '../../vehicle-entries/vehicle-entry.interface';

interface Database {
  slots: Slot[];
  vehicleEntries: VehicleEntry[];
}

@Injectable()
export class JsonDatabaseService {
  private readonly filePath = join(process.cwd(), 'db.json');
  async read(): Promise<Database> {
    const data = await readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async write(data: Database): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
