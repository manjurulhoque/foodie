import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import ReduxProvider from "@/components/ReduxProvider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SearchProvider } from "@/context/search-context";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";

export const metadata: Metadata = {
    title: "Foodie customer",
    description: "Foodie customer dashboard",
};

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

interface Props {
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = async ({ children }) => {
    const session = await getServerSession(authOptions);
    const { user } = session as Session;
    if (!user) {
        return redirect("/login");
    }
    if (user.role !== "customer") {
        return redirect("/");
    }
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
                                    <DashboardPageLayout>{children}</DashboardPageLayout>
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
