import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/header";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/components/ReduxProvider";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "Foodie",
    description: "Foodie is a food delivery app",
};

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

interface Props {
    children: React.ReactNode;
}

const RootLayout: React.FC<Props> = async ({ children }) => {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn("bg-background antialiased", urbanist.variable)}
            >
                <ReactQueryProvider>
                    <ReduxProvider>
                        <NextAuthProvider session={session}>
                            <img
                                src="/img/hero.svg"
                                className="absolute -z-10 top-0 right-0 w-full md:w-[60%]"
                                alt="hero-svg"
                            />
                            <Header />
                            {children}
                            <Footer />
                            <Toaster position="bottom-center" />
                        </NextAuthProvider>
                    </ReduxProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
};

export default RootLayout;
