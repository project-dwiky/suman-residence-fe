import Image from "next/image";

export default function AvatarGroup() {
    return (
        <div className="flex flex-col space-x-2 space-y-2 items-center justify-center">
            <div className="w-14 h-14 rounded-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1612000529646-f424a2aa1bff?w=100&h=100&fit=crop&crop=face"
                    width={48}
                    height={48}
                    alt="Guest 1"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                        width={48}
                        height={48}
                        alt="Guest 2"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                        width={48}
                        height={48}
                        alt="Guest 3"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}
