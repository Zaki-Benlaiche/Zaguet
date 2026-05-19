'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CategoryRow, PizzaRow } from '@/lib/supabase/types';
import { createPizza, updatePizza } from '@/lib/menu/admin-actions';
import styles from './form.module.css';

export default function PizzaForm({
  initial,
  categories,
  mode,
}: {
  initial?: PizzaRow;
  categories: CategoryRow[];
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? categories[0]?.id ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '/pizza-item.png');
  const [price, setPrice] = useState(initial?.price_mad ?? 0);
  const [nameFr, setNameFr] = useState(initial?.name_fr ?? '');
  const [nameAr, setNameAr] = useState(initial?.name_ar ?? '');
  const [nameEn, setNameEn] = useState(initial?.name_en ?? '');
  const [descFr, setDescFr] = useState(initial?.description_fr ?? '');
  const [descAr, setDescAr] = useState(initial?.description_ar ?? '');
  const [descEn, setDescEn] = useState(initial?.description_en ?? '');
  const [available, setAvailable] = useState(initial?.is_available ?? true);
  const [featured, setFeatured] = useState(initial?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      slug: slug.trim(),
      category_id: categoryId || null,
      image_url: imageUrl.trim() || null,
      price_mad: Number(price),
      name_fr: nameFr.trim(),
      name_ar: nameAr.trim(),
      name_en: nameEn.trim(),
      description_fr: descFr.trim(),
      description_ar: descAr.trim(),
      description_en: descEn.trim(),
      is_available: available,
      is_featured: featured,
      sort_order: Number(sortOrder) || 0,
    };

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createPizza(payload)
          : await updatePizza(initial!.id, payload);

      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        return;
      }
      router.push('/admin/menu');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Link href="/admin/menu" className={styles.back}>
        <ArrowLeft size={18} /> Retour au menu
      </Link>

      <h1>{mode === 'create' ? 'Nouvelle pizza' : 'Modifier la pizza'}</h1>

      <section className={`${styles.section} glass-panel`}>
        <h3>Identité</h3>
        <div className={styles.row}>
          <label>
            <span>Slug *</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </label>
          <label>
            <span>Catégorie</span>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name_fr}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Prix (MAD) *</span>
            <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          </label>
          <label className={styles.full}>
            <span>URL de l'image</span>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/pizza-item.png" />
          </label>
        </div>
      </section>

      <section className={`${styles.section} glass-panel`}>
        <h3>Nom (3 langues) *</h3>
        <div className={styles.row}>
          <label>
            <span>Français</span>
            <input value={nameFr} onChange={(e) => setNameFr(e.target.value)} required />
          </label>
          <label>
            <span>العربية</span>
            <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} required dir="rtl" />
          </label>
          <label>
            <span>English</span>
            <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
          </label>
        </div>
      </section>

      <section className={`${styles.section} glass-panel`}>
        <h3>Description (3 langues)</h3>
        <label className={styles.full}>
          <span>Français</span>
          <textarea rows={2} value={descFr} onChange={(e) => setDescFr(e.target.value)} />
        </label>
        <label className={styles.full}>
          <span>العربية</span>
          <textarea rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} dir="rtl" />
        </label>
        <label className={styles.full}>
          <span>English</span>
          <textarea rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} />
        </label>
      </section>

      <section className={`${styles.section} glass-panel`}>
        <h3>Affichage</h3>
        <div className={styles.toggleRow}>
          <label className={styles.checkLabel}>
            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
            <span>Disponible à la commande</span>
          </label>
          <label className={styles.checkLabel}>
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <span>Mise en avant sur l'accueil</span>
          </label>
          <label>
            <span>Ordre d'affichage</span>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </label>
        </div>
      </section>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.submitRow}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Enregistrement…' : mode === 'create' ? 'Créer' : 'Enregistrer'}
        </button>
        <Link href="/admin/menu" className="btn btn-outline">Annuler</Link>
      </div>
    </form>
  );
}
