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
    MenuSquare,
    Kanban,
    UtensilsCrossed,
    ShoppingCart,
} from "lucide-react";
import { type SidebarData } from "@/components/layout/types";

export const adminSidebarData: SidebarData = {
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
                            icon: Kanban,
                        },
                        {
                            title: "Create Restaurant",
                            url: "/admin/restaurants/new",
                            icon: MenuSquare,
                        },
                    ],
                },
                {
                    title: "Categories",
                    url: "/admin/categories",
                    icon: Palette,
                },
                {
                    title: "Cuisines",
                    url: "/admin/cuisines",
                    icon: UtensilsCrossed,
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

export const dashboardSidebarData: SidebarData = {
    navGroups: [
        {
            title: "General",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "Orders",
                    url: "/dashboard/orders",
                    icon: ShoppingCart,
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
                            url: "/dashboard/settings",
                            icon: UserCog,
                        },
                        {
                            title: "Account",
                            url: "/dashboard/settings/account",
                            icon: Settings,
                        },
                    ],
                },
            ],
        },
    ],
};
