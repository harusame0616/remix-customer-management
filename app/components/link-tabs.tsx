import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

type LinkTabsProps = {
  links: { to: string; label: string; end?: boolean }[];
};
export function LinkTabs({ links }: LinkTabsProps) {
  return (
    <ul className="flex justify-center w-full bg-muted p-2">
      {links.map((link) => (
        <li key={link.to} className="flex-grow">
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              cn(
                "no-underline h-11 flex items-center justify-center",
                isActive && "rounded shadow bg-background grow"
              )
            }
            end={link.end}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
