import { Menu } from "lucide-react";

function Header() {
  return (
    <header className="relative flex h-16 items-center justify-between bg-header px-6 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-border/50">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-header-muted hover:bg-sidebar-active hover:text-header-foreground md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-header-foreground">
            Dashboard
          </h2>
        </div>
      </div>
    </header>
  );
}

export default Header;
