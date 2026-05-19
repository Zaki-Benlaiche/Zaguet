import '../globals.css';

export const metadata = {
  title: 'Admin Zaguet',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className="page-wrapper"
        style={{ background: 'var(--color-dark-bg)' }}
      >
        {children}
      </body>
    </html>
  );
}
