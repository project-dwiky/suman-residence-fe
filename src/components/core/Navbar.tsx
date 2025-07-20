import NavbarClient from "./NavbarClient";
import { User } from "@/types/user";
import axiosServer from "@/lib/axios-server";
import { getLanguageFromCookies } from "@/utils/language";

async function getAuthenticatedUser(): Promise<User | null> {
    try {
        const response = await axiosServer.get("/api/auth/me");
        return response.data as User;
    } catch (error) {
        console.log("User not authenticated or error fetching user data");
        return null;
    }
}

async function Navbar() {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    const language = await getLanguageFromCookies();

    // Navigation links
    const navLinks = [
        { name: "Home", href: "#", scrollTo: "hero-section" },
        { name: "Gallery", href: "#", scrollTo: "gallery-section" },
        { name: "Lokasi", href: "#", scrollTo: "map-section" },
        { name: "Fasilitas", href: "#", scrollTo: "facility-section" },
        { name: "Kamar", href: "/kamar" },
    ];
    
    // Render the client component with the authenticated user data
    return <NavbarClient user={user} navLinks={navLinks} language={language} />;
}

export default Navbar;
