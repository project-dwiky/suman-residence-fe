"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/user";
import { Language } from "@/translations";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarClientProps {
    user: User | null;
    navLinks: Array<{
        name: string;
        href: string;
        scrollTo?: string;
    }>;
    language: Language;
}

const NavbarClient = ({ user, navLinks, language }: NavbarClientProps) => {
    const [scroll, setScroll] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>("hero-section");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();

    // Handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                // Redirect to home page after successful logout
                router.push("/");
                router.refresh();
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Handle dashboard navigation
    const handleDashboardClick = () => {
        setIsDropdownOpen(false);
        setMobileMenuOpen(false);
        if (user?.role === "admin") {
            router.push("/admin/dashboard");
        } else {
            router.push("/dashboard");
        }
    };

    // Function to scroll to sections
    const scrollToSection = (e: React.MouseEvent, id: string) => {
        e.preventDefault();

        // If we're on any kamar page (including detail pages), navigate to home first
        if (pathname.startsWith("/kamar")) {
            // Navigate to home page with hash
            window.location.href = `/#${id}`;
            return;
        }

        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setMobileMenuOpen(false);
        }
    };

    // Function to scroll to CTA section
    const scrollToCTA = (e: React.MouseEvent) => {
        e.preventDefault();

        // If we're on any kamar page (including detail pages), navigate to home first
        if (pathname.startsWith("/kamar")) {
            // Navigate to home page with CTA hash
            window.location.href = "/#cta-section";
            return;
        }

        const ctaSection = document.getElementById("cta-section");
        if (ctaSection) {
            ctaSection.scrollIntoView({ behavior: "smooth" });
            setMobileMenuOpen(false);
        }
    };

    // Get initials from user name or email
    const getUserInitials = (): string => {
        if (!user) return "";

        if (user.name) {
            const nameParts = user.name.split(" ");
            if (nameParts.length > 1) {
                return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
            }
            return user.name[0].toUpperCase();
        }

        return user.email[0].toUpperCase();
    };

    // Handle Scroll Event and Active Section
    useEffect(() => {
        // Set active section based on current page
        if (pathname.startsWith("/kamar")) {
            setActiveSection("kamar-page");
            return; // Don't run scroll logic on kamar pages
        }

        // If on dashboard pages, don't set any nav link as active
        if (
            pathname.startsWith("/dashboard") ||
            pathname.startsWith("/admin/dashboard")
        ) {
            setActiveSection("dashboard-page");
            return; // Don't run scroll logic on dashboard pages
        }

        // Function to update active section based on scroll position
        const updateActiveSection = () => {
            const sections = [
                "hero-section",
                "gallery-section",
                "map-section",
                "facility-section",
                "cta-section",
            ];

            // Find which section is currently in view
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If section is in viewport (with some buffer for navbar height)
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        // Function to handle scroll and navbar background
        const handleScroll = () => {
            // Handle navbar background
            if (window.scrollY > 50) {
                setScroll(true);
            } else {
                setScroll(false);
            }

            updateActiveSection();
        };

        // Function to handle hash change and initial hash detection
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            if (hash) {
                setActiveSection(hash);
                // Scroll to the section after a small delay to ensure DOM is ready
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }, 100);
            } else {
                // If no hash, determine section by scroll position
                updateActiveSection();
            }
        };

        // Check for hash on initial load
        handleHashChange();

        // Add event listeners
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("hashchange", handleHashChange);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById("user-dropdown");
            const profileButton = document.getElementById("profile-button");

            if (
                dropdown &&
                !dropdown.contains(event.target as Node) &&
                profileButton &&
                !profileButton.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav
            className={`sticky top-0 w-full z-50 transition-all duration-300 ${
                scroll
                    ? "bg-white/95 backdrop-blur-md shadow-md py-2"
                    : "bg-white/90 backdrop-blur-sm py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="h-10 transition-all duration-300 group-hover:opacity-90">
                            <Image
                                src="/logo.svg"
                                alt="Suman Residence Logo"
                                width={160}
                                height={40}
                                className="object-contain h-10"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) =>
                            link.scrollTo ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) =>
                                        scrollToSection(e, link.scrollTo!)
                                    }
                                    className={`font-medium text-sm transition-colors relative group cursor-pointer ${
                                        activeSection === link.scrollTo
                                            ? "text-secondary font-bold"
                                            : "text-primary hover:text-secondary"
                                    }`}
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-primary hover:text-secondary font-medium text-sm transition-colors relative group ${
                                        (link.href === "/kamar" &&
                                            pathname.startsWith("/kamar")) ||
                                        pathname === link.href
                                            ? "text-secondary font-bold"
                                            : ""
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            )
                        )}
                    </div>

                    <LanguageSwitcher currentLanguage={language} />

                    {/* User profile or CTA Button */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    id="profile-button"
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                                        {getUserInitials()}
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-600" />
                                </button>

                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div
                                        id="user-dropdown"
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                    >
                                        <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                                            <div className="font-medium truncate">
                                                {user.name || user.email}
                                            </div>
                                            {user.role === "admin" && (
                                                <div className="text-xs text-gray-500 truncate">
                                                    {user.role}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleDashboardClick}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Link href="/auth/login">
                                    <Button
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary/10 rounded-full transition-all duration-300 px-5"
                                    >
                                        <span>Login</span>
                                    </Button>
                                </Link>
                                <Link href="/kamar">
                                    <Button className="bg-primary text-white hover:bg-primary/90 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:scale-[1.03] px-6">
                                        <span>Book Now</span>
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-primary"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden transition-all duration-300 overflow-hidden ${
                    mobileMenuOpen
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                } ${scroll ? "bg-white" : "bg-white/95"}`}
            >
                <div className="px-4 pt-2 pb-4 space-y-3">
                    {/* Navigation links */}
                    {navLinks.map((link) =>
                        link.scrollTo ? (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`block font-medium py-2 text-sm cursor-pointer ${
                                    activeSection === link.scrollTo
                                        ? "text-secondary font-bold"
                                        : "text-primary hover:text-secondary"
                                }`}
                                onClick={(e) =>
                                    scrollToSection(e, link.scrollTo!)
                                }
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block text-primary hover:text-secondary font-medium py-2 text-sm ${
                                    (link.href === "/kamar" &&
                                        pathname.startsWith("/kamar")) ||
                                    pathname === link.href
                                        ? "text-secondary font-bold"
                                        : ""
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        )
                    )}

                    {/* User profile section for mobile */}
                    {user && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                                    {getUserInitials()}
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-gray-900">
                                        {user.name || user.email}
                                    </div>
                                    {user.role === "admin" && (
                                        <div className="text-xs text-gray-500">
                                            {user.role}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Button
                                    onClick={handleDashboardClick}
                                    className="bg-primary text-white hover:bg-primary/90 rounded-full w-full transition-all duration-300 hover:shadow-md"
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full w-full transition-all duration-300"
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Login and CTA buttons for non-logged users */}
                    {!user && (
                        <>
                            <div className="mb-3">
                                <Link href="/auth/login">
                                    <Button
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary/10 rounded-full w-full transition-all duration-300"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Button>
                                </Link>
                            </div>
                            <Button
                                onClick={scrollToCTA}
                                className="bg-primary text-white hover:bg-primary/90 rounded-full w-full transition-all duration-300 hover:shadow-md"
                            >
                                <span>Book Now</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavbarClient;
export { NavbarClient };
