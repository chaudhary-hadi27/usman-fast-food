import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Usman Fast Food',
  description: 'Order delicious fast food online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}