import { hasAuthToken } from '@/actions/headers';
import { Banner } from '@/components/banner';
import { Carousel } from '@/components/carousel';
import { RegisterForm } from '@/components/register-form';
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
        <RegisterForm />
      </div>
    </div>
  );
}
