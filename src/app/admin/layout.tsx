"use client";
import { ReactNode } from "react";
import { AdminAuthProvider } from "@/components/AdminAuthProvider";
import { AdminNavbar } from "@/components/AdminNavbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <AdminAuthProvider>
      {isLogin ? (
        children
      ) : (
        <div className="min-h-screen flex">
          <AdminNavbar />
          <main className="flex-1 pl-0">{children}</main>
        </div>
      )}
    </AdminAuthProvider>
  );
}
