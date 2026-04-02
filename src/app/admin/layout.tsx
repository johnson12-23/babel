import { getAdminSession } from "@/lib/admin-auth";
import { AdminNav } from "@/components/layout/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session?.admin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-onyx text-cream">
      <AdminNav />
      <main className="px-5 py-10 sm:px-10 lg:px-16">{children}</main>
    </div>
  );
}
