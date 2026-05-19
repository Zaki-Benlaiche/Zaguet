import { headers } from 'next/headers';
import AdminShell from './_components/AdminShell';
import { requireAdmin } from '@/lib/auth/guard';
import '../globals.css';

export const metadata = {
  title: 'Admin Zaguet',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bypass guard for the login page itself.
  const h = await headers();
  const pathname = h.get('x-invoke-path') ?? h.get('x-pathname') ?? '';
  const isLogin = pathname.endsWith('/admin/login');

  if (!isLogin) {
    try {
      await requireAdmin();
    } catch (e) {
      // requireAdmin throws redirect — let Next handle it.
      throw e;
    }
  }

  return (
    <html lang="fr">
      <body className="page-wrapper" style={{ background: 'var(--color-dark-bg)' }}>
        {isLogin ? children : <AdminShell>{children}</AdminShell>}
      </body>
    </html>
  );
}
