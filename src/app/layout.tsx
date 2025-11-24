import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

// Configuração de SEO aprimorada
export const metadata: Metadata = {
  metadataBase: new URL('https://litbook.app'), // IMPORTANTE: Adicione seu domínio real
  
  title: {
    default: "LitBook - Sua plataforma de leitura e comunidade",
    template: "%s | LitBook",
  },
  
  description: "Descubra, leia e compartilhe livros. Participe de uma comunidade de leitores e autores. Sua jornada literária começa aqui.",
  
  keywords: [
    "livros", 
    "leitura", 
    "comunidade literária", 
    "autores", 
    "publicação de livros", 
    "e-books", 
    "literatura", 
    "clube do livro",
    "ler online",
    "biblioteca digital"
  ],
  
  authors: [{ name: "LitBook", url: "https://litbook.app" }],
  creator: "LitBook",
  publisher: "LitBook",
  
  // Open Graph aprimorado
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://litbook.app",
    siteName: "LitBook",
    title: "LitBook - Sua plataforma de leitura e comunidade",
    description: "Descubra, leia e compartilhe livros. Participe de uma comunidade de leitores e autores.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LitBook - Plataforma de Leitura",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "LitBook - Sua plataforma de leitura e comunidade",
    description: "Descubra, leia e compartilhe livros. Participe de uma comunidade de leitores e autores.",
    images: ["/og-image.png"],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Alternativas e canonicais
  alternates: {
    canonical: "https://litbook.app",
    languages: {
      'pt-BR': 'https://litbook.app',
    },
  },
  
  // Informações de aplicativo
  applicationName: "LitBook",
  appleWebApp: {
    capable: true,
    title: "LitBook",
    statusBarStyle: "default",
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Ícones
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  
  // Verificações
  verification: {
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
  
  // Informações adicionais
  category: 'books',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <head>
        {/* Material Icons */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#135bec" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LitBook" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "LitBook",
              "url": "https://litbook.app",
              "description": "Plataforma de leitura e comunidade literária",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://litbook.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "LitBook",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://litbook.app/icon.svg"
                }
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
