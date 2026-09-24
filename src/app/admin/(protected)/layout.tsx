import { redirect } from 'next/navigation';
import { requireAdminPage } from '@/lib/admin';
import { AdminShell } from '../admin-shell';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdminPage();
  if ('redirect' in auth) redirect(auth.redirect);

  return <AdminShell>{children}</AdminShell>;
}
