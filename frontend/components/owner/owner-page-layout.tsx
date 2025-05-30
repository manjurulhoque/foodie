"use client";

import { User } from "@/models/user.interface";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Search } from "@/components/admin/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { useMeQuery } from "@/store/reducers/user/api";
import { OwnerSidebar } from "./owner-sidebar";

export function OwnerPageLayout({ children }: { children: React.ReactNode }) {
    const { data, isLoading } = useMeQuery(null, {});
    const user = data?.data as User;

    return (
        <>
            <OwnerSidebar user={user} isLoading={isLoading} />
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
                <DashboardHeader>
                    <div className="ml-auto flex items-center space-x-4">
                        <Search />
                        <ThemeSwitch />
                        <ProfileDropdown user={user} isLoading={isLoading} />
                    </div>
                </DashboardHeader>
                {children}
            </div>
        </>
    );
}
