import Navbar from '@/components/Navbar';
import '../styles/globals.css';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer />
      </body>
    </html>
  );
}