// data.ts
import {
  CubeIcon,
  FolderIcon,
  HomeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { NavigationItem, Team, UserNavigationItem } from "./types";

export const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  { name: "Gallery", href: "/gallery", icon: PhotoIcon, current: true },
  {
    name: "Categories",
    href: "/category",
    icon: FolderIcon, // Represents categorization or grouping
    current: true,
  },
  {
    name: "Products",
    href: "/product",
    icon: CubeIcon, // Represents products or items
    current: true,
  },
  // { name: "Team", href: "#", icon: UsersIcon, current: false },
  // { name: "Projects", href: "#", icon: FolderIcon, current: false },
  // { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  // { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  // { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

export const teams: Team[] = [
  // { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  // { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  // { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

export const userNavigation: UserNavigationItem[] = [
  { name: "Your profile", href: "#" },
  // { name: "Sign out", href: "#" },
];
