"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

const AdminAuthContext = createContext<{
  isAdmin: boolean;
  logout: () => void;
}>({
  isAdmin: false,
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);
    // Redirect if not logged in and not on login page
    if (
      !admin &&
      pathname.startsWith("/admin") &&
      pathname !== "/admin/login"
    ) {
      router.replace("/admin/login");
    }
    // Redirect to /admin if logged in and on login page
    if (admin && pathname === "/admin/login") {
      router.replace("/admin");
    }
  }, [pathname, router]);

  function logout() {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    router.replace("/admin/login");
  }

  return (
    <AdminAuthContext.Provider value={{ isAdmin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
