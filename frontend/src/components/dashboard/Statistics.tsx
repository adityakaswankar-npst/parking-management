interface StatisticsProps {
  statistics: {
    totalSlots: number;
    availableSlots: number;
    occupiedSlots: number;
    revenue: number;
  };
}

function Statistics({ statistics }: StatisticsProps) {
  const items = [
    {
      label: "Total Slots",
      value: statistics.totalSlots,
      color: "text-foreground",
    },
    {
      label: "Available",
      value: statistics.availableSlots,
      color: "text-success",
    },
    {
      label: "Occupied",
      value: statistics.occupiedSlots,
      color: "text-warning",
    },
    {
      label: "Revenue",
      value: `₹${statistics.revenue}`,
      color: "text-secondary",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold text-foreground">Statistics</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex h-24 flex-col items-center justify-center rounded-lg border border-border bg-background px-4 text-center"
          >
            <p
              className={`text-2xl font-semibold tracking-tight ${item.color}`}
            >
              {item.value}
            </p>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;
