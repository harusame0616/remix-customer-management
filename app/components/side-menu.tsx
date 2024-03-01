import { ChevronRightIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export function SideMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <HamburgerMenuIcon aria-label="メニュー" className="w-8 h-8" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">メニュー</SheetTitle>
        </SheetHeader>
        <ul className="mt-4 flex-grow">
          <SheetClose asChild>
            <MenuItem label="顧客" href="/customers" />
          </SheetClose>
          <SheetClose asChild>
            <MenuItem label="ユーザー" href="/users" />
          </SheetClose>
        </ul>
        <Button variant="outline" className="w-full">
          ログアウト
        </Button>
      </SheetContent>
    </Sheet>
  );
}

type MenuItemProps = {
  label: string;
  href: string;
  onClick?: () => void;
};
function MenuItem({ onClick, label, href }: MenuItemProps) {
  return (
    <li className="h-11 flex items-center text-lg first:border-t">
      <Link
        className="px-2 no-underline h-full w-full flex items-center border-b"
        to={href}
        onClick={onClick}
      >
        <span>{label}</span>
        <ChevronRightIcon className="w-4 h-4 ml-auto" />
      </Link>
    </li>
  );
}
