import { Suspense } from 'react';
import Image from 'next/image';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Purple Header */}
      <header className="bg-[#201747] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <Image 
            src="/hornets-logo.png" 
            alt="Charlotte Hornets Logo" 
            width={60} 
            height={60}
            className="mr-4"
          />
          <h1 className="text-2xl font-bold">Hornets Player Stats - 2024</h1>
        </div>
      </header>
      
      {/* Teal Main Content */}
      <main className="flex-grow bg-[#1d8caa] text-white p-6">
        <div className="container mx-auto">
          <Suspense fallback={<div className="text-center py-10 bg-black bg-opacity-70 rounded-lg p-4">Loading statistics...</div>}>
            <DashboardContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
} 