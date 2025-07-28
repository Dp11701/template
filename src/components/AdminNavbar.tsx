import { IconGauge, IconNotes } from "@tabler/icons-react";
import { Code, Group, ScrollArea } from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import { UserButton } from "./UserButton";
import { Logo } from "./Logo";

const mockdata = [
  {
    label: "Dashboard",
    icon: IconGauge,
    links: [{ label: "Dashboard", link: "/admin/dashboard" }],
  },
  {
    label: "Landingpage",
    icon: IconNotes,
    links: [{ label: "Landingpage", link: "/admin/landingpage" }],
  },
];

export function AdminNavbar() {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <div className="h-screen w-[260px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col p-4">
      <div className="mb-4">
        <Group justify="space-between">
          <Logo style={{ width: 120 }} />
          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div>{links}</div>
      </ScrollArea>
      <div className="mt-4">
        <UserButton />
      </div>
    </div>
  );
}
