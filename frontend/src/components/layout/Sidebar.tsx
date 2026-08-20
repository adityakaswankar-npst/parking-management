import { Car, History, LayoutDashboard, ParkingSquare } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Parking Slots",
    path: "/slots",
    icon: ParkingSquare,
  },
  {
    name: "Active Vehicles",
    path: "/vehicles",
    icon: Car,
  },
  {
    name: "History",
    path: "/history",
    icon: History,
  },
];

function Sidebar() {
  return (
    <aside className="hidden w-50 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
      <div className="flex min-h-screen flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="text-[#8FB8E8]">Park</span>
            <span className="text-[#38A2D4]">Ease</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-active text-sidebar-foreground"
                      : "text-sidebar-muted hover:bg-sidebar-active hover:text-sidebar-foreground"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
