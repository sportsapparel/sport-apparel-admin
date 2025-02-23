import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "./className";
import { NavigationItem } from "./types";

interface NavigationProps {
  items: NavigationItem[];
}

export const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const pathname = usePathname();

  // console.log(`Current Pathname: ${pathname}`);

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname.startsWith("/dashboard")
            : pathname.startsWith(item.href);
        console.log(
          `Item: ${item.name}, Href: ${item.href}, Pathname: ${pathname}, IsActive: ${isActive}`
        );

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={classNames(
                isActive
                  ? "text-black bg-textColor/40"
                  : "text-gray-700 hover:bg-gray-50 hover:text-textColor",
                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
              )}
            >
              <item.icon
                aria-hidden="true"
                className={classNames(
                  isActive
                    ? "text-black"
                    : "text-textColor group-hover:text-textColor",
                  "size-6 shrink-0"
                )}
              />
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
