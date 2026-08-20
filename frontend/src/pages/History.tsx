import { useEffect, useMemo, useState } from "react";

import {
  getVehicleEntries,
  type VehicleEntry,
} from "../api/vehicle-entries.api";

type Filter = "All" | "Active" | "Completed";

function History() {
  const [vehicleEntries, setVehicleEntries] = useState<VehicleEntry[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getVehicleEntries();
      setVehicleEntries(data);
    } catch (error) {
      console.error("Failed to fetch parking history:", error);
      setError("Unable to load parking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredEntries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return vehicleEntries.filter((entry) => {
      const isActive = entry.exitTime === null;

      const matchesSearch =
        normalizedSearch === "" ||
        entry.vehicleNumber.toLowerCase().includes(normalizedSearch);

      let matchesFilter = true;

      if (filter === "Active") {
        matchesFilter = isActive;
      }

      if (filter === "Completed") {
        matchesFilter = !isActive;
      }

      return matchesSearch && matchesFilter;
    });
  }, [vehicleEntries, filter, search]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading parking history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-destructive">{error}</p>

        <button
          type="button"
          onClick={fetchHistory}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Parking History
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View all parking entries and completed parking activity.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <div>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by vehicle number"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-4 flex gap-2">
          {(["All", "Active", "Completed"] as Filter[]).map((option) => (
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
                Vehicle
              </th>

              <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                Type
              </th>

              <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                Slot
              </th>

              <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                Entry Time
              </th>

              <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                Exit Time
              </th>

              <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                Parking Fee
              </th>

              <th className="px-5 py-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-muted-foreground"
                >
                  No parking entries match your search or filter.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => {
                const isActive = entry.exitTime === null;

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {entry.vehicleNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {entry.vehicleType}
                    </td>

                    <td className="px-5 py-4 text-sm text-foreground">
                      {entry.slotId}
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(entry.entryTime).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {entry.exitTime
                        ? new Date(entry.exitTime).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium">
                      {entry.parkingFee !== null ? `₹${entry.parkingFee}` : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-medium ${
                          isActive ? "text-primary" : "text-success"
                        }`}
                      >
                        {isActive ? "Active" : "Completed"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
