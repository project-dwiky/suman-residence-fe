import React from 'react';
import RentalDetailPage from '@/components/user-dashboard/pages/RentalDetailPage';
import Navbar from '@/components/core/Navbar';
import Footer from '@/components/core/Footer';

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default async function RentalDetailView({ params }: DetailPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16 pb-20">
        <RentalDetailPage rentalId={params.id} />
      </main>
      <Footer />
    </>
  );
}
