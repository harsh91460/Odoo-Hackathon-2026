import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const location = useLocation();
  // Simple logic to extract the page title from the URL path
  const pageTitle = location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard';

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-8">
          {/* This is where your page content will automatically be injected */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}