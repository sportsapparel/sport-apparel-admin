import Link from "next/link";
import { classNames } from "./className";
import { NavigationItem } from "./types";

interface NavigationProps {
  items: NavigationItem[];
}

export const Navigation: React.FC<NavigationProps> = ({ items }) => (
  <ul role="list" className="-mx-2 space-y-1">
    {items.map((item) => (
      <li key={item.name}>
        <Link
          href={item.href}
          className={classNames(
            item.current
              ? "bg-gray-50 text-textColor"
              : "text-gray-700 hover:bg-gray-50 hover:text-textColor",
            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
          )}
        >
          <item.icon
            aria-hidden="true"
            className={classNames(
              item.current
                ? "text-textColor"
                : "text-gray-400 group-hover:text-textColor",
              "size-6 shrink-0"
            )}
          />
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
);
