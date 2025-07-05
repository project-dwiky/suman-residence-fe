import { Metadata } from "next";
import { ForgotPasswordSection } from "@/components/auth/sections";

export const metadata: Metadata = {
  title: "Forgot Password | Suman Residence",
  description: "Reset your Suman Residence account password.",
  keywords: ["forgot password", "reset password", "suman residence", "accommodation", "booking"],
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background/95 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ForgotPasswordSection />
      </div>
    </div>
  );
}
