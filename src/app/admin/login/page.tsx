"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
} from "@mantine/core";

const ADMIN_EMAIL = "admin@admin";
const ADMIN_PASSWORD = "admin1701";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
        <Title order={2} className="mb-6 text-center">
          Admin Login
        </Title>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          {error && (
            <Text color="red" size="sm">
              {error}
            </Text>
          )}
          <Button type="submit" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}
