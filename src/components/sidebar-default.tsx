import { SidebarFooter } from "@/components/sidebar-footer";
import { SidebarNav } from "@/components/sidebar-nav";

export function SidebarDefault() {
  return (
    <>
      <div>
        {/* Identity */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            Chayut
            <br />
            Chunsamphran
          </h1>
          <p className="mt-1.5 text-xs text-muted">Design Engineer</p>
        </div>

        <p className="mb-8 max-w-[220px] text-xs leading-relaxed text-dim">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
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
