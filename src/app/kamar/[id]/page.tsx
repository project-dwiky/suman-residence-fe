import Navbar from "@/components/core/Navbar";
import RoomDetail from "@/components/kamar/RoomDetail";
import { getLanguageFromCookies } from '@/utils/language';


export default async function RoomDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const roomId = (await params).id;
    const language = await getLanguageFromCookies();
    
    return <>
    <Navbar/>
    <RoomDetail roomId={roomId} language={language} />
    </>;
}
