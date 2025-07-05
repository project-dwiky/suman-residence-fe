import { Metadata } from "next";
import { LoginSection } from "@/components/auth/sections";

export const metadata: Metadata = {
  title: "Login | Suman Residence",
  description: "Sign in to your Suman Residence account to access your bookings, preferences, and more.",
  keywords: ["login", "sign in", "suman residence", "accommodation", "booking"],
};

// Define props interface for the page component
type LoginPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {

  const search = await searchParams;
  // Extract message, success message, and redirectTo from URL search parameters
  const message = typeof search.message === 'string' ? search.message : undefined;
  const success = typeof search.success === 'string' ? search.success : undefined;
  const registered = typeof search.registered === 'string' ? true : false;
  const redirectTo = typeof search.redirectTo === 'string' ? search.redirectTo : '/dashboard';
  
  return (
    <div className="min-h-screen bg-background/95 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginSection 
          message={message} 
          success={success}
          registered={registered}
          redirectTo={redirectTo} 
        />
      </div>
    </div>
  );
}
