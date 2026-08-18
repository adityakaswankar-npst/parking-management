export type VehicleType = 'CAR' | 'BIKE';

export interface Slot {
  id: number;
  slotNumber: string;
  vehicleType: VehicleType;
}
