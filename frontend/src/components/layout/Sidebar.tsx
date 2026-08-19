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
    <aside className="hidden w-64 shrink-0 border-r bg-slate-950 text-slate-100 md:block">
      <div className="flex h-full min-h-screen flex-col">
        <div className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-lg font-semibold tracking-tight">
            Parking Management
          </h1>
          <p className="mt-1 text-xs text-slate-400">Parking facility</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
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
