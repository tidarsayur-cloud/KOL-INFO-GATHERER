import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KOL Info Gatherer | Influencer Analytics Platform',
  description:
    'Discover, analyze, and compare influencers across TikTok, Instagram, and YouTube. Powered by KaloData and KOL.ID.',
  keywords: 'influencer analytics, KOL, TikTok analytics, Instagram analytics, YouTube analytics',
  authors: [{ name: 'KOL Info Gatherer' }],
  openGraph: {
    title: 'KOL Info Gatherer | Influencer Analytics Platform',
    description: 'Premium influencer intelligence platform for Indonesia',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-950 text-white flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
