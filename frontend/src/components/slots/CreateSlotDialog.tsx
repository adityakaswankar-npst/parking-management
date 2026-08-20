import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { createSlot } from "../../api/slots.api";

const createSlotSchema = z.object({
  slotNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]-\d{2}$/, "Slot number must follow the format A-01"),
  vehicleType: z.enum(["CAR", "BIKE"]),
});

interface CreateSlotDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateSlotDialog({ open, onClose, onSuccess }: CreateSlotDialogProps) {
  const [slotNumber, setSlotNumber] = useState("");
  const [vehicleType, setVehicleType] = useState<"CAR" | "BIKE">("CAR");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = createSlotSchema.safeParse({
      slotNumber,
      vehicleType,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createSlot({
        slotNumber: result.data.slotNumber,
        vehicleType: result.data.vehicleType,
      });
      toast.success("Parking slot created successfully.");
      setSlotNumber("");
      setVehicleType("CAR");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create slot:", error);
      toast.error("Unable to create parking slot.");
      setError("Unable to create slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Add Parking Slot
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a new parking slot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="slotNumber"
              className="text-sm font-medium text-foreground"
            >
              Slot Number
            </label>

            <input
              id="slotNumber"
              type="text"
              value={slotNumber}
              onChange={(event) =>
                setSlotNumber(event.target.value.toUpperCase())
              }
              placeholder="A-05"
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="vehicleType"
              className="text-sm font-medium text-foreground"
            >
              Vehicle Type
            </label>

            <select
              id="vehicleType"
              value={vehicleType}
              onChange={(event) =>
                setVehicleType(event.target.value as "CAR" | "BIKE")
              }
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="CAR">CAR</option>
              <option value="BIKE">BIKE</option>
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
              {loading ? "Creating..." : "Create Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSlotDialog;
