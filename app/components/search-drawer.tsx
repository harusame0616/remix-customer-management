import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { PropsWithChildren } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "./ui/button";

type Props = PropsWithChildren;
export function SearchDrawer({ children }: Props) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <MagnifyingGlassIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>検索</DrawerTitle>
        </DrawerHeader>
        <div>{children}</div>
        <DrawerFooter>
          <Button>検索する</Button>
          <DrawerClose>
            <Button variant="outline">キャンセル</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
