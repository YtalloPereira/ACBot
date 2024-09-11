import { Metadata } from 'next';
import { Chicle, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const chicle = Chicle({ weight: '400', subsets: ['latin'], variable: '--font-chicle' });

export const metadata: Metadata = {
  title: 'Academic Soon',
  description:
    'Uma aplicação para disponibilizar informações acadêmicas de instituições.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} ${chicle.variable}`}>{children}</body>
    </html>
  );
}
