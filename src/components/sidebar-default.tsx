import { SidebarFooter } from "@/components/sidebar-footer";
import { SidebarNav } from "@/components/sidebar-nav";

export function SidebarDefault() {
  return (
    <>
      <div>
        {/* Identity */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Chayut C.</h1>
          <p className="mt-1.5 text-xs text-muted">Design Engineer</p>
        </div>

        <p
          className="mb-8 max-w-[220px] animate-fade-in-up text-xs leading-relaxed text-dim"
          style={{ animationDelay: "80ms" }}
        >
          Welcome! I&apos;m Chayut, and you&apos;re in my digital playground. It&apos;s a collection
          of my experiments on interaction and interface design. Feel free to explore!
        </p>

        {/* Separator */}
        <div
          className="mb-6 h-px w-10 origin-left animate-expand-line bg-mid"
          style={{ animationDelay: "160ms" }}
        />

        {/* Navigation */}
        <div className="animate-fade-in-up" style={{ animationDelay: "240ms" }}>
          <SidebarNav />
        </div>
      </div>

      {/* Bottom */}
      <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <SidebarFooter />
      </div>
    </>
  );
}
