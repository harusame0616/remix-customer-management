import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { SideMenu } from "~/components/side-menu";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function LoggedInLayout() {
  return (
    <>
      <header className="flex items-center py-2">
        <div className="md:hidden h-11 px-2">
          <SideMenu />
        </div>
        <div className="hidden md:flex h-11 px-4 items-center flex-grow">
          <div className="font-bold text-xl">顧客管理システム</div>
          <nav className="ml-12 flex-grow h-full">
            <ul className="flex gap-4 h-full">
              <MenuItem label="顧客" href="/customers" />
              <MenuItem label="ユーザー" href="/users" />
            </ul>
          </nav>
          <div>
            <Button variant="outline">ログアウト</Button>
          </div>
        </div>
      </header>
      <Separator />
      <div className="grow overflow-hidden">
        <main className="p-4 h-full overflow-y-scroll">
          <Outlet />
        </main>
      </div>
    </>
  );
}

type MenuItemProps = {
  label: string;
  href: string;
};
function MenuItem({ label, href }: MenuItemProps) {
  return (
    <li className="h-11 flex items-center text-lg font-bold text-muted-foreground hover:text-inherit">
      <Link
        className="group px-2 no-underline h-full flex items-center transition duration-300 relative"
        to={href}
      >
        <span>{label}</span>
        <span className="absolute bottom-0 right-0 left-0 block h-[2px] opacity-0 bg-black group-hover:opacity-60 transition-all" />
      </Link>
    </li>
  );
}