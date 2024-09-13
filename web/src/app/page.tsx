import { hasAuthToken } from '@/actions/headers';
import { Chatbot } from '@/components/chatbot';
import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { redirect } from 'next/navigation';

export default async function Home() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    redirect('/login');
  }

  return (
    <Main>
      <Header />
      <Chatbot />
    </Main>
  );
}
