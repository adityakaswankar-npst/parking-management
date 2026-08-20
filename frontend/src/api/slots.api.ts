import api from "./axios";

export interface Slot {
  id: number;
  slotNumber: string;
  vehicleType: "CAR" | "BIKE";
}

export interface CreateSlotData {
  slotNumber: string;
  vehicleType: "CAR" | "BIKE";
}

export interface UpdateSlotData {
  slotNumber: string;
  vehicleType: "CAR" | "BIKE";
}

export async function getSlots(): Promise<Slot[]> {
  const response = await api.get<Slot[]>("/slots");

  return response.data;
}

export async function createSlot(data: CreateSlotData): Promise<Slot> {
  const response = await api.post<Slot>("/slots", data);

  return response.data;
}

export async function updateSlot(
  id: number,
  data: UpdateSlotData,
): Promise<Slot> {
  const response = await api.put<Slot>(`/slots/${id}`, data);

  return response.data;
}

export async function deleteSlot(id: number): Promise<void> {
  await api.delete(`/slots/${id}`);
}
