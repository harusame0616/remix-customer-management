import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { PropsWithChildren, useId, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useSort } from "~/hooks/use-sort";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

type Props = PropsWithChildren<{
  className: string;
}>;
export function SearchDrawer({ children, className }: Props) {
  const formId = useId();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const submit = useSubmit();
  const form = useFormContext();
  const { sortOrder, sortKey } = useSort();

  const handleSubmit = form.handleSubmit((data) => {
    setDrawerOpen(false);

    submit(
      {
        ...Object.fromEntries(
          Object.entries(data).filter(([, v]) => v !== undefined),
        ),
        page: 1,
        sortOrder,
        ...(sortKey ? { sortKey } : {}),
      },
      {
        method: "GET",
      },
    );
  });

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          検索 <MagnifyingGlassIcon aria-hidden />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>検索</DrawerTitle>
        </DrawerHeader>
        <search>
          <Form {...form}>
            <form
              className={cn(
                "space-y-8 overflow-y-auto max-h-[50svh] p-8",
                className,
              )}
              onSubmit={handleSubmit}
              id={formId}
            >
              {children}
            </form>
          </Form>
        </search>
        <DrawerFooter>
          <Button form={formId}>検索</Button>
          <DrawerClose asChild>
            <Button variant="outline" type="button">
              キャンセル
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
