import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.role)) redirect("/produits");

  return (
    <div className="flex min-h-screen bg-grain">
      <Sidebar role={user.role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
