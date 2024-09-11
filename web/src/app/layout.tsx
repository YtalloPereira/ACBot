import { ConfigureAmplify } from '@/components/configure-amplify';
import { Toast } from '@/components/toast';
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider } from '@/contexts/theme';
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
      <body className={`${inter.className} ${chicle.variable}`}>
        <ThemeProvider>
          <ConfigureAmplify>
            <AuthProvider>
              <Toast />
              {children}
            </AuthProvider>
          </ConfigureAmplify>
        </ThemeProvider>
      </body>
    </html>
  );
}
