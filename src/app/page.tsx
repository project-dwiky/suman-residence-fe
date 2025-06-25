import Homepage from "@/components/homepage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suman Residence | Cozy Living Space di Kota Banda Aceh",
  description: "Suman Residence menawarkan akomodasi nyaman dengan fasilitas modern di lokasi strategis Kota Banda Aceh. Booking kamar dan nikmati pengalaman menginap terbaik.",
  keywords: ["suman residence", "penginapan banda aceh", "hotel banda aceh", "akomodasi nyaman aceh", "living space banda aceh"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Suman Residence | Cozy Living Space di Kota Banda Aceh",
    description: "Suman Residence menawarkan akomodasi nyaman dengan fasilitas modern di lokasi strategis Kota Banda Aceh.",
    url: "/",
    siteName: "Suman Residence",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605146769289-440113cc3d00", // Sesuaikan dengan gambar hero yang digunakan
        width: 1200,
        height: 630,
        alt: "Suman Residence Banda Aceh",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  creator: "Suman Residence",
  publisher: "Suman Residence",
};

export default function Home() {
  return <Homepage/>;
}
