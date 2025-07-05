import ResetPasswordSection from "@/components/auth/sections/ResetPasswordSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Suman Residence",
  description: "Reset your Suman Residence account password.",
  keywords: ["reset password", "forgot password", "suman residence", "accommodation", "booking"],
};

// Define props interface for the page component
type ResetPasswordPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : undefined;
  
  return (
    <div className="min-h-screen bg-background/95 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ResetPasswordSection token={token} />
      </div>
    </div>
  );
}
