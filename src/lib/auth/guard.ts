import 'server-only';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('user_id, role, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    // Authenticated but not an admin — force sign-out + redirect.
    await supabase.auth.signOut();
    redirect('/admin/login?error=not-admin');
  }

  return { user, profile };
}
