'use client';

import { useState } from 'react';
import { loginAction } from '@/lib/auth/actions';
import styles from './login.module.css';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setPending(true);
    const result = await loginAction(formData);
    setPending(false);
    if (result && !result.ok) {
      setError(result.error ?? 'Erreur de connexion.');
    }
  };

  return (
    <form action={handleSubmit} className={styles.form}>
      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@zaguet.ma"
        />
      </label>
      <label>
        <span>Mot de passe</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
