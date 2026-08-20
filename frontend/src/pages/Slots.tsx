import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteSlot, getSlots, type Slot } from "../api/slots.api";
import ParkVehicleDialog from "../components/vehicles/ParkVehicleDialog";
import {
  exitVehicle,
  getVehicleEntries,
  type VehicleEntry,
} from "../api/vehicle-entries.api";

import CreateSlotDialog from "../components/slots/CreateSlotDialog";
import EditSlotDialog from "../components/slots/EditSlotDialog";

type Filter = "All" | "Available" | "Occupied";

function Slots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [vehicleEntries, setVehicleEntries] = useState<VehicleEntry[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
  const [isParkVehicleOpen, setIsParkVehicleOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

  const fetchSlotsPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [slotsData, vehicleEntriesData] = await Promise.all([
        getSlots(),
        getVehicleEntries(),
      ]);

      setSlots(slotsData);
      setVehicleEntries(vehicleEntriesData);
    } catch (error) {
      console.error("Failed to fetch slots page data:", error);
      setError("Unable to load parking slot data.");
    } finally {
      setLoading(false);
    }
  };

  const getSlotNumber = (slotId: number) => {
    return (
      slots.find((slot) => slot.id === slotId)?.slotNumber ?? `Slot ${slotId}`
    );
  };

  const handleExitVehicle = async (entry: VehicleEntry) => {
    const confirmed = window.confirm(
      `Exit vehicle ${entry.vehicleNumber} from slot ${getSlotNumber(entry.slotId)}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await exitVehicle(entry.id);
      toast.success(`${entry.vehicleNumber} exited successfully.`);
      await fetchSlotsPageData();
    } catch (error) {
      console.error("Failed to exit vehicle:", error);
      toast.error("Unable to exit the vehicle.");
      setError("Unable to exit the vehicle.");
    }
  };
  useEffect(() => {
    fetchSlotsPageData();
  }, []);

  const activeEntries = useMemo(
    () => vehicleEntries.filter((entry) => entry.exitTime === null),
    [vehicleEntries],
  );

  const getActiveEntry = (slotId: number) => {
    return activeEntries.find((entry) => entry.slotId === slotId);
  };

  const filteredSlots = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return slots.filter((slot) => {
      const activeEntry = getActiveEntry(slot.id);
      const isOccupied = Boolean(activeEntry);

      const matchesSearch =
        normalizedSearch === "" ||
        slot.slotNumber.toLowerCase().includes(normalizedSearch) ||
        activeEntry?.vehicleNumber.toLowerCase().includes(normalizedSearch);

      let matchesFilter = true;

      if (filter === "Available") {
        matchesFilter = !isOccupied;
      }

      if (filter === "Occupied") {
        matchesFilter = isOccupied;
      }

      return matchesSearch && matchesFilter;
    });
  }, [slots, activeEntries, search, filter]);

  const handleDelete = async (slot: Slot) => {
    const activeEntry = getActiveEntry(slot.id);

    if (activeEntry) {
      alert("An occupied slot cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(`Delete slot ${slot.slotNumber}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteSlot(slot.id);
      toast.success(`Slot ${slot.slotNumber} deleted.`);
      await fetchSlotsPageData();
    } catch (error) {
      console.error("Failed to delete slot:", error);
      toast.error("Unable to delete the selected slot.");
      setError("Unable to delete the selected slot.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading parking slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-destructive">{error}</p>

        <button
          type="button"
          onClick={fetchSlotsPageData}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Parking Slots
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage parking spaces and current occupancy.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsParkVehicleOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Plus size={16} />
              Add Vehicle
            </button>

            <button
              type="button"
              onClick={() => setIsCreateSlotOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <Plus size={16} />
              Add Slot
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
            <Search size={17} className="text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by slot or vehicle number"
              className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-4 flex gap-2">
            {(["All", "Available", "Occupied"] as Filter[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  filter === option
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                  Slot
                </th>

                <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                  Vehicle Type
                </th>

                <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>

                <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                  Entry Time
                </th>

                <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSlots.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    No parking slots match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot) => {
                  const activeEntry = getActiveEntry(slot.id);
                  const isOccupied = Boolean(activeEntry);

                  return (
                    <tr
                      key={slot.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-foreground">
                          {slot.slotNumber}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {slot.vehicleType}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-medium ${
                            isOccupied ? "text-warning" : "text-success"
                          }`}
                        >
                          {isOccupied ? "Occupied" : "Available"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {activeEntry ? (
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {activeEntry.vehicleNumber}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {activeEntry.vehicleType}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {activeEntry
                          ? new Date(activeEntry.entryTime).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {!isOccupied ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditingSlot(slot)}
                                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(slot)}
                                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-destructive hover:bg-muted"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleExitVehicle(activeEntry!)}
                              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                            >
                              Exit Vehicle
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateSlotDialog
        open={isCreateSlotOpen}
        onClose={() => setIsCreateSlotOpen(false)}
        onSuccess={fetchSlotsPageData}
      />

      <EditSlotDialog
        slot={editingSlot}
        open={editingSlot !== null}
        onClose={() => setEditingSlot(null)}
        onSuccess={fetchSlotsPageData}
      />

      <ParkVehicleDialog
        open={isParkVehicleOpen}
        onClose={() => setIsParkVehicleOpen(false)}
        onSuccess={fetchSlotsPageData}
        slots={slots}
        vehicleEntries={vehicleEntries}
      />
    </>
  );
}

export default Slots;
