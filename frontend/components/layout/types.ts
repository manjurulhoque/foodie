interface BaseNavItem {
    title: string;
    badge?: string;
    icon?: React.ElementType;
}

type NavLink = BaseNavItem & {
    url: any;
    items?: never;
};

type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { url: any })[];
    url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
    title: string;
    items: NavItem[];
}

interface SidebarData {
    navGroups: NavGroup[];
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
