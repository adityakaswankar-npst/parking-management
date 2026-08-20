import { useState } from "react";
import { ArrowRight, Bike, Car, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Slot } from "../../api/slots.api";
import type { VehicleEntry } from "../../api/vehicle-entries.api";

import CreateSlotDialog from "../slots/CreateSlotDialog";
import ParkVehicleDialog from "../vehicles/ParkVehicleDialog";

interface OccupancyProps {
  slots: Slot[];
  vehicleEntries: VehicleEntry[];
  onRefresh: () => void;
}

function Occupancy({ slots, vehicleEntries, onRefresh }: OccupancyProps) {
  const navigate = useNavigate();

  const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
  const [isParkVehicleOpen, setIsParkVehicleOpen] = useState(false);

  const activeEntries = vehicleEntries.filter(
    (entry) => entry.exitTime === null,
  );

  const displayedSlots = slots.slice(0, 8);

  const getActiveEntry = (slotId: number) => {
    return activeEntries.find((entry) => entry.slotId === slotId);
  };

  const handleAddVehicle = () => {
    setIsParkVehicleOpen(true);
  };

  const handleAddSlot = () => {
    setIsCreateSlotOpen(true);
  };

  const handleViewAllSlots = () => {
    navigate("/slots");
  };

  const totalSlots = slots.length;
  const occupiedSlots = activeEntries.length;
  const availableSlots = totalSlots - occupiedSlots;

  const occupancyPercentage =
    totalSlots === 0 ? 0 : Math.round((occupiedSlots / totalSlots) * 100);

  return (
    <>
      <section className="h-full rounded-xl border border-border bg-card p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Parking Occupancy
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddVehicle}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Plus size={16} />
              Add Vehicle
            </button>

            <button
              type="button"
              onClick={handleAddSlot}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Plus size={16} />
              Add Slot
            </button>

            <button
              type="button"
              onClick={handleViewAllSlots}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              View All Slots
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {displayedSlots.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                No parking slots available
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Add a slot to start managing parking.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              {displayedSlots.map((slot) => {
                const activeEntry = getActiveEntry(slot.id);
                const isOccupied = Boolean(activeEntry);

                return (
                  <div
                    key={slot.id}
                    className={`w-36 rounded-lg border p-4 ${
                      isOccupied
                        ? "border-warning/30 bg-warning/10"
                        : "border-success/30 bg-success/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {slot.slotNumber}
                      </p>

                      {slot.vehicleType === "CAR" ? (
                        <Car size={18} className="text-muted-foreground" />
                      ) : (
                        <Bike size={18} className="text-muted-foreground" />
                      )}
                    </div>

                    <p
                      className={`mt-3 truncate text-xs font-semibold ${
                        isOccupied ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {activeEntry?.vehicleNumber ?? "No vehicle"}
                    </p>

                    <p
                      className={`mt-2 text-xs font-medium ${
                        isOccupied ? "text-warning" : "text-success"
                      }`}
                    >
                      {isOccupied ? "Occupied" : "Available"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Occupancy
                </p>

                <p className="text-sm font-semibold text-brand-light">
                  {occupancyPercentage}%
                </p>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {occupiedSlots} of {totalSlots} slots occupied ·{" "}
                {availableSlots} available
              </p>
            </div>
          </>
        )}
      </section>

      <CreateSlotDialog
        open={isCreateSlotOpen}
        onClose={() => setIsCreateSlotOpen(false)}
        onSuccess={onRefresh}
      />

      <ParkVehicleDialog
        open={isParkVehicleOpen}
        onClose={() => setIsParkVehicleOpen(false)}
        onSuccess={onRefresh}
        slots={slots}
        vehicleEntries={vehicleEntries}
      />
    </>
  );
}

export default Occupancy;
