import { Banner } from '@/components/banner';
import { Carousel } from '@/components/carousel';
import { hasAuthToken } from '@/lib/auth-token';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Criar conta | Academic Soon',
};

export default async function Register() {
  const authToken = await hasAuthToken();

  if (authToken) {
    redirect('/');
  }

  return (
    <div className="flex h-screen">
      <Carousel />
      <div className="flex w-full flex-col overflow-y-auto lg:w-[550px]">
        <Banner />
      </div>
    </div>
  );
}
