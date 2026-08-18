import { VehicleType } from '../slots/slot.interface';

export interface VehicleEntry {
  id: number;
  vehicleNumber: string;
  vehicleType: VehicleType;
  entryTime: string;
  exitTime: string | null;
  slotId: number;
}
