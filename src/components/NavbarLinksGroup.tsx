import React, { useState } from "react";
import { UnstyledButton, ThemeIcon, Collapse, Text, rem } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

interface LinksGroupProps {
  icon: React.ElementType;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links) && links.length > 0;
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component={Link}
      href={link.link}
      className="block py-1.5 pl-9 pr-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
      key={link.label}
      size="sm"
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => hasLinks && setOpened((o) => !o)}
        className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <ThemeIcon
          variant="light"
          size={30}
          className="bg-gray-200 dark:bg-gray-700"
        >
          <Icon style={{ width: rem(18), height: rem(18) }} />
        </ThemeIcon>
        <span className="flex-1 text-left text-gray-800 dark:text-gray-100 font-medium">
          {label}
        </span>
        {hasLinks && (
          <IconChevronLeft
            className={`transition-transform ${opened ? "-rotate-90" : "rotate-0"}`}
            size={18}
            stroke={1.5}
          />
        )}
      </UnstyledButton>
      {hasLinks && <Collapse in={opened}>{items}</Collapse>}
    </>
  );
}
