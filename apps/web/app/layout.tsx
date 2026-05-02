import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/ui/ChatWidget';
import type { Metadata, Viewport } from 'next';
import { Noto_Serif_Devanagari, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const displayFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const devanagariFont = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['500', '700'],
  variable: '--font-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Election Yatra — Janta ka Election Saathi',
  description:
    'An India-first AI companion for every voter. Understand the election process, spot misinformation, and vote with confidence.',
  applicationName: 'Election Yatra',
  keywords: [
    'Indian elections',
    'voter education',
    'ECI',
    'SVEEP',
    'civic education',
    'misinformation',
  ],
  openGraph: {
    title: 'Election Yatra — Janta ka Election Saathi',
    description:
      'Your AI saathi for the election journey — registration to polling booth, in your language.',
    type: 'website',
    locale: 'en_IN',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF9933',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${devanagariFont.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col relative">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-indigo-chakra focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <NavBar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
