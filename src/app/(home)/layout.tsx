import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PanelShell } from "@/components/panel-shell";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PanelShell>
      {/* Persistent breadcrumb — stays mounted across page navigations */}
      <div className="shrink-0 px-5 pt-6 lg:absolute lg:top-0 lg:right-0 lg:left-[var(--panel-split)] lg:z-20 lg:bg-paper lg:px-8 lg:pt-10 lg:pb-4 xl:px-12 print:hidden">
        <BreadcrumbNav />
      </div>
      <main className="min-w-0 flex-1 lg:overflow-hidden">{children}</main>
    </PanelShell>
  );
}
