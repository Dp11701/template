"use client";
import Link from "next/link";
import { Button } from "@mantine/core";
import { useAdminAuth } from "./AdminAuthProvider";

export default function Sidebar() {
  const { logout } = useAdminAuth();

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white dark:bg-gray-900 shadow-md border-r border-gray-200 dark:border-gray-800 z-20 flex flex-col justify-between">
      {/* Navigation */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-3">
          <Link
            href="/admin/landingpage"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Landingpage
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Dashboard
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-6">
        <Button
          variant="outline"
          color="red"
          fullWidth
          onClick={logout}
          className="font-medium"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
