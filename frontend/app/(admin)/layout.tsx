import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/header";

export const metadata: Metadata = {
    title: "Foodie admin",
    description: "Foodie admin dashboard",
};

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn("bg-background antialiased", urbanist.variable)}
            >
                <img
                    src="/img/hero.svg"
                    className="absolute -z-10 top-0 right-0 w-full md:w-[60%]"
                    alt="hero-svg"
                />
                <Header/>
                {children}
            </body>
        </html>
    );
}
