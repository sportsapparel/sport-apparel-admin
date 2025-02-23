// import Image from "next/image";
// import { TeamsList } from "./TeamList";
import { NavigationItem, Team } from "./types";
import { Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/outline";
import { Navigation } from "./Navigation";
import { signOut } from "next-auth/react";
interface SidebarProps {
  navigation: NavigationItem[];
  teams: Team[];
}

// export const Sidebar: React.FC<SidebarProps> = ({ navigation, teams }) => (
export const Sidebar: React.FC<SidebarProps> = ({ navigation }) => (
  <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
    <div className="flex h-16 shrink-0 items-center">
      {/* <Image
        alt="Your Company"
        src="/api/placeholder/32/32"
        width={32}
        height={32}
        className="h-8 w-auto"
      /> */}
      <h1 className="text-center w-full">ADMIN</h1>
    </div>
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <Navigation items={navigation} />
        </li>
        {/* <li>
          <TeamsList teams={teams} />
        </li> */}
        <li className="mt-auto">
          <div
            onClick={() =>
              signOut({
                callbackUrl: "/",
                redirect: true,
              })
            }
            className="group -mx-2 flex gap-x-3 rounded-md p-2   text-gray-700 hover:bg-gray-50 hover:text-textColor"
          >
            <PowerIcon
              aria-hidden="true"
              className="size-6 shrink-0 text-textColor group-hover:text-textColor"
            />
            Logout
          </div>
        </li>
      </ul>
    </nav>
  </div>
);
