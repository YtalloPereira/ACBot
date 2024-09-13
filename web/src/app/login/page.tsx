import { hasAuthToken } from '@/actions/headers';
import { Banner } from '@/components/banner';
import { Carousel } from '@/components/carousel';
import { LoginForm } from '@/components/login-form';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Entrar | Academic Soon',
};

export default async function Login() {
  const authToken = await hasAuthToken();

  if (authToken) {
    redirect('/');
  }

  return (
    <div className="flex h-screen">
      <Carousel />
      <div className="flex w-full flex-col overflow-y-auto lg:w-[550px]">
        <Banner />
        <LoginForm />
      </div>
    </div>
  );
}
