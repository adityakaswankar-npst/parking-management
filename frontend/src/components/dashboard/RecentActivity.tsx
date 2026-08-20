import type { VehicleEntry } from "../../api/vehicle-entries.api";

interface RecentActivityProps {
  vehicleEntries: VehicleEntry[];
}

function RecentActivity({ vehicleEntries }: RecentActivityProps) {
  const completedEntries = vehicleEntries
    .filter((entry) => entry.exitTime !== null)
    .sort(
      (a, b) =>
        new Date(b.exitTime!).getTime() - new Date(a.exitTime!).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2> 
        </div>
      </div>

      <div className="space-y-3">
        {completedEntries.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No completed parking activity yet.
          </p>
        ) : (
          completedEntries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-6 items-center gap-4 rounded-lg border border-border bg-background p-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {entry.vehicleNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.vehicleType}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Slot</p>
                <p className="text-sm font-medium text-foreground">
                  {entry.slotId}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Entry</p>
                <p className="text-sm text-foreground">
                  {new Date(entry.entryTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Exit</p>
                <p className="text-sm text-foreground">
                  {new Date(entry.exitTime!).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Fee</p>
                <p className="text-sm font-medium text-success">
                  ₹{entry.parkingFee ?? 0}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium text-muted-foreground">
                  Completed
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default RecentActivity;
