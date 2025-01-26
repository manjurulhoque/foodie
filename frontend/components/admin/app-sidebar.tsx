"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/layout/nav-group";
import { NavUser } from "@/components/layout/nav-user";
import { sidebarData } from "@/components/admin/data/sidebar-data";
import { useMeQuery } from "@/store/reducers/user/api";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/models/user.interface";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data, isLoading } = useMeQuery(null, {});
    const user = data?.data as User;
    return (
        <Sidebar collapsible="icon" variant="floating" {...props}>
            <SidebarHeader>
                Admin
            </SidebarHeader>
            <SidebarContent>
                {sidebarData.navGroups.map((props: any) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <NavUser user={user} />
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
