import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getSession();
  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1d8caa] text-white">
      <header className="bg-[#201747] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image 
                src="/hornets-logo.png" 
                alt="Charlotte Hornets Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <Link href="/dashboard" className="text-xl font-bold">
              Hornets Dashboard
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="hover:underline">
              Home
            </Link>
            <Link href="/api/auth/logout?returnTo=/" className="hover:underline">
              Logout
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-[#201747] text-white p-4">
        <div className="container mx-auto text-center">
          <p>© 2024 Hornets Stats Dashboard</p>
        </div>
      </footer>
    </div>
  );
} 