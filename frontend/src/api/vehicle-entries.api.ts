import api from "./axios";

export interface VehicleEntry {
  id: number;
  vehicleNumber: string;
  vehicleType: "CAR" | "BIKE";
  entryTime: string;
  exitTime: string | null;
  slotId: number;
  parkingFee: number | null;
}

export interface CreateVehicleEntryData {
  vehicleNumber: string;
  vehicleType: "CAR" | "BIKE";
  slotId: number;
}

export async function getVehicleEntries(): Promise<VehicleEntry[]> {
  const response = await api.get<VehicleEntry[]>("/vehicle-entries");

  return response.data;
}

export async function createVehicleEntry(
  data: CreateVehicleEntryData,
): Promise<VehicleEntry> {
  const response = await api.post<VehicleEntry>("/vehicle-entries", data);

  return response.data;
}

export async function exitVehicle(id: number): Promise<VehicleEntry> {
  const response = await api.put<VehicleEntry>(`/vehicle-entries/${id}/exit`);

  return response.data;
}
