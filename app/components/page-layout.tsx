import { PropsWithChildren } from "react";
import { Separator } from "./ui/separator";

type Props = PropsWithChildren<{
  title: string;
  toolbarItems?: React.ReactNode[];
  footer?: React.ReactNode;
}>;
export function PageLayout({ footer, children, title, toolbarItems }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:px-4 flex h-16">
        <h1 className="font-bold text-xl flex items-center">{title}</h1>
        <ul className="flex-grow flex justify-end gap-4 items-center">
          {toolbarItems?.map((item) => item)}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col flex-grow overflow-hidden">{children}</div>
      <Separator />
      <div>{footer}</div>
    </div>
  );
}
