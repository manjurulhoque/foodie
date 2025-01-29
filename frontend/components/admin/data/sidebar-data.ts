import {
    HelpCircle,
    LayoutDashboard,
    Bell,
    Settings,
    UserCog,
    Users,
    Palette,
    Command,
    Citrus,
} from "lucide-react";
import { type SidebarData } from "@/components/layout/types";

export const sidebarData: SidebarData = {
    user: {
        name: "Admin",
        email: "admin@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Shadcn Admin",
            logo: Command,
            plan: "Vite + ShadcnUI",
        },
    ],
    navGroups: [
        {
            title: "General",
            items: [
                {
                    title: "Dashboard",
                    url: "/",
                    icon: LayoutDashboard,
                },
                {
                    title: "Customers",
                    url: "/admin/customers",
                    icon: Users,
                },
                {
                    title: "Restaurants",
                    icon: Citrus,
                    items: [
                        {
                            title: "Restaurants",
                            url: "/admin/restaurants",
                            icon: Citrus,
                        },
                        {
                            title: "Create Restaurant",
                            url: "/admin/restaurants/new",
                            icon: Citrus,
                        },
                    ],
                },
            ],
        },
        {
            title: "Other",
            items: [
                {
                    title: "Settings",
                    icon: Settings,
                    items: [
                        {
                            title: "Profile",
                            url: "/settings",
                            icon: UserCog,
                        },
                        {
                            title: "Account",
                            url: "/settings/account",
                            icon: Settings,
                        },
                        {
                            title: "Appearance",
                            url: "/settings/appearance",
                            icon: Palette,
                        },
                        {
                            title: "Notifications",
                            url: "/settings/notifications",
                            icon: Bell,
                        },
                    ],
                },
                {
                    title: "Help Center",
                    url: "/help-center",
                    icon: HelpCircle,
                },
            ],
        },
    ],
};
