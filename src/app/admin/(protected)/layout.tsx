import AdminShell from '../_components/AdminShell';
import { requireAdmin } from '@/lib/auth/guard';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
