import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Radhix Estates | Luxury Real Estate & Prime Properties',
  description:
    'Experience extraordinary duplexes, penthouses, and modernist villas across India’s premier corridors. Powered by Radhix Technologies.',
  keywords: [
    'luxury real estate',
    'penthouses',
    'villas',
    'commercial offices',
    'Radhix Estates',
    'Radhix Technologies',
  ],
  authors: [{ name: 'Radhix Technologies' }],
  openGraph: {
    title: 'Radhix Estates - Luxury Real Estate Platform',
    description: 'Find, explore, and acquire verified prime luxury properties.',
    url: 'https://estates.radhix.com',
    siteName: 'Radhix Estates',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider defaultTheme="dark">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
