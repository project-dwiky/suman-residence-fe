import RoomDetail from "@/components/kamar/RoomDetail";


export default async function RoomDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const roomId = (await params).id;
    return <RoomDetail roomId={roomId} />;
}
