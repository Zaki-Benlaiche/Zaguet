import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Utensils, LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';
import styles from './adminShell.module.css';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          <span className="text-gradient">Zaguet</span>
          <span className={styles.adminBadge}>Admin</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/admin">
            <LayoutDashboard size={18} /> Tableau de bord
          </Link>
          <Link href="/admin/orders">
            <ShoppingBag size={18} /> Commandes
          </Link>
          <Link href="/admin/menu">
            <Utensils size={18} /> Menu
          </Link>
        </nav>

        <form action={logoutAction} className={styles.logoutForm}>
          <button type="submit" className={styles.logout}>
            <LogOut size={18} /> Déconnexion
          </button>
        </form>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
