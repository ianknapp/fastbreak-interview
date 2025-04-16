import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Check if user is authenticated
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1d8caa] text-white">
      <div className="max-w-md w-full bg-[#201747] rounded-lg shadow-xl p-8 m-4">
        <div className="flex items-center justify-center mb-6">
          <Image 
            src="/hornets-logo.png" 
            alt="Charlotte Hornets Logo" 
            width={80} 
            height={80}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">Hornets Stats Dashboard</h1>
        <p className="text-center mb-8">
          Access exclusive statistics for Charlotte Hornets players.
        </p>
        <div className="flex justify-center">
          <Link 
            href="/api/auth/login?returnTo=/dashboard" 
            className="px-6 py-3 bg-[#1d8caa] text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}