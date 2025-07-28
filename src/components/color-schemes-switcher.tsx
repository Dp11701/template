"use client";

import { useMantineColorScheme, Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";

export function ColorSchemesSwitcher() {
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Group>
        <Button disabled>Light</Button>
        <Button disabled>Dark</Button>
        <Button disabled>Auto</Button>
        <Button disabled>Clear</Button>
      </Group>
    );
  }

  return (
    <Group>
      <Button onClick={() => setColorScheme("light")}>Light</Button>
      <Button onClick={() => setColorScheme("dark")}>Dark</Button>
      <Button onClick={() => setColorScheme("auto")}>Auto</Button>
      <Button onClick={clearColorScheme}>Clear</Button>
    </Group>
  );
}
