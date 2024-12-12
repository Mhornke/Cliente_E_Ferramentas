import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from 'sonner'
import { CarrinhoProvider } from "@/context/carrinho";

export const metadata: Metadata = {
  title: "E-Ferramentas",
  description: "Revendedor de Ferramentas Eletricas",
  icons: {
    icon: '/favicon_io/favicon.ico', 
  },
  keywords: ['Furradeiras', 'Lixadeiras', 'Obra', 'Ferramentas eletricas'],

  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
      <CarrinhoProvider>
        <Header />
          
        {children}
        </CarrinhoProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}