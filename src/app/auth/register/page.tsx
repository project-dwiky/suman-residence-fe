import { Metadata } from "next";
import { RegisterSection } from "@/components/auth/sections";

export const metadata: Metadata = {
  title: "Register | Suman Residence",
  description: "Create a new account at Suman Residence to start booking accommodations, access exclusive offers, and manage your reservations.",
  keywords: ["register", "sign up", "create account", "suman residence", "accommodation", "booking"],
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background/95 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegisterSection />
      </div>
    </div>
  );
}
