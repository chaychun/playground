import { SidebarFooter } from "@/components/sidebar-footer";
import { SidebarNav } from "@/components/sidebar-nav";

export function SidebarDefault() {
  return (
    <>
      <div>
        {/* Identity */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink">Chayut C.</h1>
          <p className="mt-1.5 text-xs text-muted">Design Engineer</p>
        </div>

        <p className="mb-8 max-w-[220px] text-xs leading-relaxed text-dim">
          Welcome! I&apos;m Chayut, and you&apos;re in my digital playground. It&apos;s a
          collection of my experiments on interaction and interface design. Feel free to explore!
        </p>

        {/* Separator */}
        <div className="mb-6 h-px w-10 bg-mid" />

        {/* Navigation */}
        <SidebarNav />
      </div>

      {/* Bottom */}
      <SidebarFooter />
    </>
  );
}
