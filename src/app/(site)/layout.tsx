import { Sidebar } from "@/components/sidebar";
import { SidebarDefault } from "@/components/sidebar-default";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh bg-paper">
      <Sidebar>
        <SidebarDefault />
      </Sidebar>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
