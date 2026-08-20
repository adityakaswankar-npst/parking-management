import { useState } from "react";
import { z } from "zod";
import type { VehicleEntry } from "../../api/vehicle-entries.api";
import {
  createVehicleEntry,
  type CreateVehicleEntryData,
} from "../../api/vehicle-entries.api";
import { toast } from "sonner";

import type { Slot } from "../../api/slots.api";

const parkVehicleSchema = z.object({
  vehicleNumber: z
    .string()
    .trim()
    .min(1, "Vehicle number is required")
    .regex(
      /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
      "Enter a valid vehicle number",
    ),

  vehicleType: z.enum(["CAR", "BIKE"]),

  slotId: z.number().positive("Select a parking slot"),
});

interface ParkVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slots: Slot[];
  vehicleEntries: VehicleEntry[];
}

function ParkVehicleDialog({
  open,
  onClose,
  onSuccess,
  slots,
  vehicleEntries,
}: ParkVehicleDialogProps) {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] =
    useState<CreateVehicleEntryData["vehicleType"]>("CAR");
  const [slotId, setSlotId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const activeSlotIds = new Set(
    vehicleEntries
      .filter((entry) => entry.exitTime === null)
      .map((entry) => entry.slotId),
  );

  const availableSlots = slots.filter(
    (slot) => slot.vehicleType === vehicleType && !activeSlotIds.has(slot.id),
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = parkVehicleSchema.safeParse({
      vehicleNumber,
      vehicleType,
      slotId,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createVehicleEntry(result.data);

      toast.success(`${result.data.vehicleNumber} parked successfully.`);

      setVehicleNumber("");
      setVehicleType("CAR");
      setSlotId("");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to park vehicle:", error);
      toast.error("Unable to park vehicle.");
      setError("Unable to park vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Park Vehicle
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a vehicle to the parking facility.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="vehicle-number"
              className="text-sm font-medium text-foreground"
            >
              Vehicle Number
            </label>

            <input
              id="vehicle-number"
              type="text"
              value={vehicleNumber}
              onChange={(event) =>
                setVehicleNumber(event.target.value.toUpperCase())
              }
              placeholder="MH12AB1234"
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="vehicle-type"
              className="text-sm font-medium text-foreground"
            >
              Vehicle Type
            </label>

            <select
              id="vehicle-type"
              value={vehicleType}
              onChange={(event) => {
                setVehicleType(event.target.value as "CAR" | "BIKE");
                setSlotId("");
              }}
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="CAR">CAR</option>
              <option value="BIKE">BIKE</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="parking-slot"
              className="text-sm font-medium text-foreground"
            >
              Parking Slot
            </label>

            <select
              id="parking-slot"
              value={slotId}
              onChange={(event) =>
                setSlotId(event.target.value ? Number(event.target.value) : "")
              }
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Select a slot</option>

              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.slotNumber}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {loading ? "Parking..." : "Park Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParkVehicleDialog;
