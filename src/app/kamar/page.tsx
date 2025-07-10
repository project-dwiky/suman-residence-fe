import Navbar from "@/components/core/Navbar";
import Kamar from "@/components/kamar/Kamar";
import { getLanguageFromCookies } from '@/utils/language';

export default async function page() {
  const language = await getLanguageFromCookies();
  
  return (
    <>
    <Navbar/>
    <Kamar language={language}/>
    </>
  )
}