import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoginForm from './LoginForm';
import styles from './login.module.css';

export const metadata = {
  title: 'Admin Zaguet — Connexion',
};

export default async function LoginPage({
  searchParams,
}: PageProps<'/admin/login'>) {
  const sp = await searchParams;
  const errorParam = typeof sp?.error === 'string' ? sp.error : undefined;

  // If already authed + admin, go straight to dashboard
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profile) redirect('/admin');
    }
  } catch {
    // Supabase not configured — show the form anyway with a notice
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} glass-panel`}>
        <Link href="/" className={styles.brand}>
          <span className="text-gradient">Zaguet</span> · Admin
        </Link>
        <h1>Connexion</h1>
        <p className={styles.sub}>Espace réservé au personnel du restaurant.</p>

        {errorParam === 'not-admin' && (
          <div className={styles.error}>
            Ce compte n'a pas accès à l'administration.
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
