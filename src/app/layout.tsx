import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Soulmatter | AI-Powered Semantic Matchmaking',
  description: 'Find your people through AI embeddings and vector-powered semantic matchmaking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen selection:bg-primary selection:text-primary-foreground">
        <div className="fixed inset-0 bg-gradient-mesh -z-10 opacity-40 pointer-events-none" />
        <main className="relative z-0">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
