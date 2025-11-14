import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Usman Fast Food - Order Delicious Food Online',
  description: 'Order fresh burgers, pizzas, fries and drinks online. Fast delivery to your doorstep.',
  keywords: 'fast food, burger, pizza, online food order, Lahore',
  authors: [{ name: 'Usman Fast Food' }],
  openGraph: {
    title: 'Usman Fast Food',
    description: 'Order delicious fast food online',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fbbf24',
              fontWeight: 'bold',
            },
            success: {
              iconTheme: {
                primary: '#fbbf24',
                secondary: '#000',
              },
            },
          }}
        />
      </body>
    </html>
  );
}