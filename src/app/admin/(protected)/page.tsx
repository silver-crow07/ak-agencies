import { redirect } from 'next/navigation';
import { requireAdminPage } from '@/lib/admin';
import { DashboardMetrics } from './dashboard-metrics';

export default async function AdminDashboardPage() {
  const auth = await requireAdminPage();
  if ('redirect' in auth) redirect(auth.redirect);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[#241B18]">Dashboard</h1>
        <p className="text-sm font-sans text-[#6B5E57] mt-1">
          Welcome back, {auth.session.name}
        </p>
      </div>
      <DashboardMetrics />
    </div>
  );
}
