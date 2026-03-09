import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PanelShell } from "@/components/panel-shell";
import { PanelTransitionOverlay } from "@/components/panel-transition-overlay";
import { ScrollEdgeBlur } from "@/components/scroll-edge-blur";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PanelShell>
      {/* Persistent breadcrumb — stays mounted across page navigations */}
      <div className="relative z-20 shrink-0 lg:absolute lg:top-0 lg:right-0 lg:left-[var(--panel-split)] print:hidden">
        <div className="bg-paper/80 px-5 pt-4 pb-1 backdrop-blur-xl lg:px-8 lg:pt-10 xl:px-12">
          <BreadcrumbNav />
        </div>
        <ScrollEdgeBlur
          direction="top"
          blurIntensity={0.5}
          className="absolute inset-x-0 top-full h-8"
        />
      </div>
      <main className="min-w-0 flex-1 overflow-y-auto lg:overflow-hidden">{children}</main>
      <PanelTransitionOverlay />
    </PanelShell>
  );
}
