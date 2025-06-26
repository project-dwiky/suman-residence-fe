import RoomDetail from "@/components/kamar/RoomDetail";

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  return <RoomDetail roomId={params.id} />;
} 