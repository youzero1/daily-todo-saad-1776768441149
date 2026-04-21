import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daily Todo App',
  description: 'A simple daily task manager to keep you productive',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
