import { Avatar, Group, Text, Button } from "@mantine/core";
import { useAdminAuth } from "./AdminAuthProvider";

export function UserButton() {
  const { logout } = useAdminAuth();
  return (
    <Group gap={8} className="w-full justify-between">
      <Group gap={8}>
        <Avatar color="blue" radius="xl">
          A
        </Avatar>
        <div>
          <Text size="sm" fw={500} className="text-gray-800 dark:text-gray-100">
            Admin
          </Text>
          <Text size="xs" c="dimmed">
            admin@admin
          </Text>
        </div>
      </Group>
      <Button size="xs" variant="outline" color="red" onClick={logout}>
        Logout
      </Button>
    </Group>
  );
}
