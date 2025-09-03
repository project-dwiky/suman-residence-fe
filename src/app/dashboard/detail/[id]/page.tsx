import React from 'react';
import RentalDetailPage from '@/components/user-dashboard/pages/RentalDetailPage';
import Navbar from '@/components/core/Navbar';
import Footer from '@/components/core/Footer';

interface DetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RentalDetailView({ params }: DetailPageProps) {
  const { id } = await params;
  console.log(id);
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <RentalDetailPage rentalId={id} />
      </main>
      <Footer />
    </>
  );
}
