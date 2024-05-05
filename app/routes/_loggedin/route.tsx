import type { LinksFunction } from "@remix-run/node";
import { NavLink, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { Logo } from "~/components/logo";
import { SideMenu } from "~/components/side-menu";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import stylesheet from "~/tailwind.css";
import { loader } from "./controller";
import { haveAuthorization } from "~/lib/auth";
import { Role } from "~/domains/auth-user/roles";
export { loader } from "./controller";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function LoggedInLayout() {
  const fetcher = useFetcher();
  const loadData = useLoaderData<typeof loader>();
  const { role } = loadData;

  return (
    <>
      <header className="flex items-center py-2">
        <div className="md:hidden h-11 px-2">
          <SideMenu />
        </div>
        <div className="hidden md:flex h-11 px-4 items-center flex-grow">
          <Logo />
          <nav className="ml-12 flex-grow h-full">
            <ul className="flex gap-4 h-full">
              <MenuItem label="取引" href="/deals" />
              <MenuItem label="顧客" href="/customers" />
              {haveAuthorization([Role.Admin], role) && (
                <MenuItem label="ユーザー" href="/users" />
              )}
            </ul>
          </nav>
          <div>
            <Button
              variant="outline"
              type="button"
              onClick={() => fetcher.load("/logout")}
            >
              ログアウト
            </Button>
          </div>
        </div>
      </header>
      <Separator />
      <main className="grow overflow-auto">
        <Outlet />
      </main>
    </>
  );
}

type MenuItemProps = {
  label: string;
  href: string;
};
function MenuItem({ label, href }: MenuItemProps) {
  return (
    <li className="h-11 flex items-center">
      <NavLink
        className="group px-2 no-underline h-full flex items-center transition duration-300 relative motion-reduce:duration-0"
        to={href}
      >
        <span className="text-lg font-bold text-muted-foreground hover-inherit group-aria-current-page:text-inherit">
          {label}
        </span>
        <span className="absolute bottom-0 right-0 left-0 block h-[2px] opacity-0 bg-black group-hover:opacity-60 transition-all group-aria-current-page:opacity-60" />
      </NavLink>
    </li>
  );
}
