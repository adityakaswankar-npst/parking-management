import { useEffect, useState } from "react";

import { getSlots, type Slot } from "../api/slots.api";
import {
  getVehicleEntries,
  type VehicleEntry,
} from "../api/vehicle-entries.api";

import Occupancy from "../components/dashboard/Occupancy";
import RecentActivity from "../components/dashboard/RecentActivity";
import Statistics from "../components/dashboard/Statistics";

function Dashboard() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [vehicleEntries, setVehicleEntries] = useState<VehicleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
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
      console.error("Failed to fetch dashboard data:", error);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const activeEntries = vehicleEntries.filter(
    (entry) => entry.exitTime === null,
  );

  const occupiedSlotIds = new Set(activeEntries.map((entry) => entry.slotId));

  const revenue = vehicleEntries.reduce(
    (total, entry) => total + (entry.parkingFee ?? 0),
    0,
  );

  const statistics = {
    totalSlots: slots.length,
    occupiedSlots: occupiedSlotIds.size,
    availableSlots: slots.length - occupiedSlotIds.size,
    revenue,
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your parking facility
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Statistics statistics={statistics} />
        </div>

        <div className="col-span-2">
          <Occupancy
            slots={slots}
            vehicleEntries={vehicleEntries}
            onRefresh={fetchDashboardData}
          />
        </div>

        <div className="col-span-3">
          <RecentActivity vehicleEntries={vehicleEntries} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
