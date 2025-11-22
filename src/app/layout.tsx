
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LitBook - Sua plataforma de leitura e comunidade.",
    template: "%s | LitBook",
  },
  description: "Descubra, leia e compartilhe livros. Participe de uma comunidade de leitores e autores. Sua jornada literária começa aqui.",
  keywords: ["livros", "leitura", "comunidade literária", "autores", "publicação de livros", "e-books", "literatura", "clube do livro"],
  authors: [{ name: "LitBook" }],
  creator: "LitBook",
  publisher: "LitBook",
  openGraph: {
    title: "LitBook - Sua plataforma de leitura e comunidade.",
    description: "Descubra, leia e compartilhe livros. Participe de uma comunidade de leitores e autores.",
    url: "https://litbook.app", // Substituir pela URL real do seu app
    siteName: "LitBook",
    images: [
      {
        url: "/og-image.png", // Criar e adicionar uma imagem em /public/og-image.png
        width: 1200,
        height: 630,
        alt: "LitBook - Plataforma de Leitura",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LitBook - Sua plataforma de leitura e comunidade.",
    description: "Descubra, leia e compartilhe livros. Participe de uma comunidade de leitores e autores.",
    images: ["/og-image.png"], // A mesma imagem do Open Graph
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "LitBook",
  appleWebApp: {
    title: "LitBook",
    statusBarStyle: "default",
    capable: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
       <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#135bec" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LitBook" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
