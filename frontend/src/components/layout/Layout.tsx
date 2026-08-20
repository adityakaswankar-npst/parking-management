import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">Content</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
