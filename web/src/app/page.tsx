import { hasAuthToken } from '@/lib/auth-token';
import { redirect } from 'next/navigation';

export default async function Home() {
  const authToken = await hasAuthToken();

  if (!authToken) {
    redirect('/login');
  }

  return (
    <main>
      <h1>Home</h1>
    </main>
  );
}
