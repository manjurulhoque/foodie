import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import ReduxProvider from "@/components/ReduxProvider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { SearchProvider } from "@/context/search-context";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { Search } from "@/components/admin/search";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
    title: "Foodie admin",
    description: "Foodie admin dashboard",
};

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

interface Props {
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = async ({ children }) => {
    const session = await getServerSession(authOptions);
    const defaultOpen = Cookies.get("sidebar:state") !== "false";
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn("bg-background antialiased", urbanist.variable)}
            >
                <ReactQueryProvider>
                    <ReduxProvider>
                        <NextAuthProvider session={session}>
                            <SidebarProvider defaultOpen={defaultOpen}>
                                <SearchProvider>
                                    <AppSidebar />
                                    <div
                                        id="content"
                                        className={cn(
                                            "max-w-full w-full ml-auto",
                                            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
                                            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
                                            "transition-[width] ease-linear duration-200",
                                            "h-svh flex flex-col",
                                            "group-data-[scroll-locked=1]/body:h-full",
                                            "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
                                        )}
                                    >
                                        <Header>
                                            <div className="ml-auto flex items-center space-x-4">
                                                <Search />
                                                <ThemeSwitch />
                                                <ProfileDropdown />
                                            </div>
                                        </Header>
                                        {children}
                                    </div>
                                    <Toaster position="bottom-center" />
                                </SearchProvider>
                            </SidebarProvider>
                        </NextAuthProvider>
                    </ReduxProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
};

export default AdminLayout;
