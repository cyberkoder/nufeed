"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<{ name: string; email: string } | null>(
        null
    );
    const router = useRouter();

    useEffect(() => {
        // Get search query from URL when component mounts
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");
        if (query) {
            setSearchQuery(query);
        }

        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data");
            }
        }
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/");
    };

    return (
        <header className="w-full bg-white shadow-xs py-4 px-6">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex flex-col">
                    <Link href="/" className="text-xl font-bold">
                        NuFeed
                    </Link>
                    <span className="text-xs text-gray-500 italic">
                        News for the Nu Generation
                    </span>
                </div>

                <form onSubmit={handleSearch} className="w-1/3 mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-300"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="flex gap-6 items-center">
                    <Link href="/finance" className="hover:text-gray-600">
                        Finance
                    </Link>
                    <Link href="/categories" className="hover:text-gray-600">
                        Categories
                    </Link>

                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center space-x-1 text-zinc-600 hover:text-zinc-800">
                                <span>{user.name}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="text-zinc-600 hover:text-zinc-800"
                        >
                            Login / Sign up
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
