import { MobileFooter } from "@/components/mobile-footer";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";
import { SidebarDefault } from "@/components/sidebar-default";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col bg-paper lg:h-svh lg:flex-row">
      <Sidebar>
        <SidebarDefault />
      </Sidebar>
      <MobileHeader />
      <main className="min-w-0 flex-1 lg:overflow-y-auto lg:overscroll-y-auto">{children}</main>
      <MobileFooter />
    </div>
  );
}
