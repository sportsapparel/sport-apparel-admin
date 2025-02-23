// types.ts
export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
}

export interface Team {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
}

export interface UserNavigationItem {
  name: string;
  href: string;
}
export interface Stat {
  label: string;
  value: number;
  icon: string;
}
