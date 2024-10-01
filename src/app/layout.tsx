import Navbar from '@/components/Navbar';
import '../styles/globals.css';
import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Navbar />
        <main className="min-h-screen bg-gray-100">{children}</main>
      </body>
    </html>
  );
}