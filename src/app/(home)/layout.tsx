import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PanelShell } from "@/components/panel-shell";
import { getPanelWidthBySlug } from "@/lib/content";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const panelWidthMap = await getPanelWidthBySlug();

  return (
    <PanelShell panelWidthMap={panelWidthMap}>
      {/* Persistent breadcrumb — stays mounted across page navigations */}
      <div className="shrink-0 px-5 pt-6 after:pointer-events-none after:hidden lg:absolute lg:top-0 lg:right-0 lg:left-[var(--panel-split)] lg:z-20 lg:bg-paper/80 lg:px-8 lg:pt-10 lg:pb-4 lg:backdrop-blur-xl lg:after:absolute lg:after:inset-x-0 lg:after:top-full lg:after:block lg:after:h-10 lg:after:bg-linear-to-b lg:after:from-paper/60 lg:after:to-transparent xl:px-12 print:hidden">
        <BreadcrumbNav />
      </div>
      <main className="min-w-0 flex-1 lg:overflow-hidden">{children}</main>
    </PanelShell>
  );
}
