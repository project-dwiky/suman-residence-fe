import UserDashboardPage from "@/components/user-dashboard/pages/UserDashboardPage";
import Navbar from "@/components/core/Navbar";
import { getLanguageFromCookies } from '@/utils/language';

export default async function Page() {
  const language = await getLanguageFromCookies();
  
  return (
    <>
      <Navbar />
      <UserDashboardPage language={language} />
    </>
  )
}
