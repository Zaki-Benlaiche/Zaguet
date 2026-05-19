# Zaguet — Pizza au feu de bois

Site web officiel + système de gestion des commandes pour le restaurant **Zaguet**.

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **React 19.2** + React Compiler
- **TypeScript 5**
- **Tailwind v4** (utilitaires) + **CSS Modules** (composants)
- **Supabase** (Postgres + Auth + Storage + Realtime)
- **lucide-react** + brand SVGs (Instagram/Facebook/TikTok/WhatsApp)

## Fonctionnalités

### Site public (3 langues : 🇫🇷 FR / 🇲🇦 AR / 🇬🇧 EN)

- Accueil avec section héro, sélection de pizzas, histoire du restaurant
- Menu complet avec catégories (Classique / Signature / Végétarienne)
- Page Contact (adresse, téléphone, horaires, carte Google Maps)
- Sélecteur de langue avec support **RTL** complet pour l'arabe
- Panier persistant (`localStorage`)
- Tunnel de commande (livraison / à emporter / sur place, paiement, adresse)
- Bouton flottant WhatsApp
- Footer avec réseaux sociaux

### Espace administrateur (`/admin`)

- Authentification Supabase (email/mot de passe)
- **Tableau de bord** : CA du jour, commandes du jour/semaine, commandes en cours
- **Commandes en temps réel** (Supabase Realtime) :
  - Notification sonore + notification système à chaque nouvelle commande
  - Filtres par statut, transitions de statut en un clic
  - Détail complet (client, articles, paiement)
- **Gestion du menu** (CRUD) :
  - Création / modification / suppression de pizzas
  - Toggle de disponibilité
  - Édition dans les 3 langues simultanément
  - Mise en avant (featured) sur l'accueil

## Installation

### 1. Dépendances

```bash
npm install
```

### 2. Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir :

```bash
cp .env.example .env.local
```

Récupérer les clés depuis le dashboard Supabase :
**Settings → API → Project URL / anon key / service_role key**

### 3. Base de données

Dans **Supabase → SQL Editor**, exécuter le fichier :

```
supabase/schema.sql
```

Ce script crée :
- Les tables `categories`, `pizzas`, `orders`, `order_items`, `admin_profiles`
- Les enums (`order_status`, `delivery_type`, `payment_method`)
- Les politiques RLS (lecture publique pour le menu, écriture publique pour les commandes)
- Le publication Realtime sur `orders` et `order_items`
- Les données initiales du menu (9 pizzas pré-remplies)

### 4. Créer le premier compte administrateur

1. Aller dans **Supabase → Authentication → Users → Add user**
2. Créer un utilisateur (email + mot de passe)
3. Récupérer son `user_id`
4. Dans le **SQL Editor**, exécuter :

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('<USER_ID_HERE>', 'Admin Zaguet', 'admin');
```

### 5. Démarrer

```bash
npm run dev
```

- Site public : http://localhost:3000 (redirige vers `/fr` par défaut)
- Admin : http://localhost:3000/admin/login

## Personnalisation rapide

| Élément | Fichier |
|---|---|
| Coordonnées (téléphone, adresse, horaires, réseaux) | `src/config/restaurant.ts` |
| Logo / nom de marque dans la barre de nav | `src/i18n/dictionaries/*.json` (clé `brand.name`) |
| Textes du site | `src/i18n/dictionaries/{fr,ar,en}.json` |
| Couleurs et thème | `src/app/globals.css` (variables `--color-*`) |
| Tarif de livraison par défaut | `src/app/[lang]/checkout/CheckoutForm.tsx` (constante `DELIVERY_FEE_MAD`) |
| Carte Google Maps | `src/config/restaurant.ts` (`mapsEmbedSrc`) |

## Structure du projet

```
src/
├── app/
│   ├── [lang]/              ← Site public (FR/AR/EN)
│   │   ├── layout.tsx       ← Layout localisé + I18nProvider + dir="rtl"
│   │   ├── page.tsx         ← Accueil
│   │   ├── menu/
│   │   ├── contact/
│   │   └── checkout/
│   ├── admin/               ← Espace administrateur
│   │   ├── login/
│   │   ├── orders/
│   │   └── menu/
│   └── globals.css
├── components/              ← Navbar, Footer, PizzaCard, CartModal, …
├── config/restaurant.ts     ← Coordonnées du restaurant
├── context/CartContext.tsx  ← Panier (avec persistance localStorage)
├── data/pizzas.ts           ← Menu statique (fallback si pas de Supabase)
├── i18n/                    ← Dictionnaires + I18nProvider
├── lib/
│   ├── auth/                ← Login / guard requireAdmin
│   ├── orders/              ← Server actions commandes
│   ├── menu/                ← Server actions menu
│   └── supabase/            ← Clients server / browser / admin
└── proxy.ts                 ← Détection de locale (anciennement middleware.ts)
```

## Déploiement Vercel

1. Importer le repo sur [vercel.com](https://vercel.com/new)
2. Ajouter les mêmes variables d'environnement que dans `.env.local`
3. Deploy

Le proxy (middleware) de routing i18n et toutes les server actions fonctionnent automatiquement.

## Sécurité

- Les clés `SUPABASE_SERVICE_ROLE_KEY` ne sont **jamais** exposées au client — elles ne sont utilisées que dans les server actions (`src/lib/**/*-actions.ts`).
- Les politiques RLS de Supabase protègent les tables : seuls les utilisateurs présents dans `admin_profiles` peuvent lire/modifier les commandes et le menu.
- Le public peut uniquement (i) lire le menu actif (ii) créer une commande.

## TODO / Améliorations futures

- [ ] Régénérer les types Supabase via `supabase gen types` (au lieu de `src/lib/supabase/types.ts` maintenu à la main)
- [ ] Upload d'images directement dans Supabase Storage depuis l'admin
- [ ] Email/SMS automatique au client lors du changement de statut
- [ ] Paiement en ligne (Stripe / CMI)
- [ ] Galerie photo du restaurant
- [ ] Suivi de commande client (page publique `/order/[id]`)
- [ ] Mode sombre/clair toggle
- [ ] Animations View Transitions (React 19.2)
