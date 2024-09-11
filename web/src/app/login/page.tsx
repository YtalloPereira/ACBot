import { Banner } from '@/components/banner';
import { Carousel } from '@/components/carousel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar | Academic Soon',
};

export default async function Login() {
  return (
    <div className="flex h-screen">
      <Carousel />
      <div className="flex w-full flex-col overflow-y-auto lg:w-[550px]">
        <Banner />
      </div>
    </div>
  );
}
