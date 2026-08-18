import { VehicleType } from './slot';

export interface VehicleEntry {
  id: number;
  vehicleNumber: string;
  vehicleType: VehicleType;
  entryTime: string;
  exitTime: string | null;
  slotId: number;
}
