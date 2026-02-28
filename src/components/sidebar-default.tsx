import { SidebarFooter } from "@/components/sidebar-footer";
import { SidebarNav } from "@/components/sidebar-nav";

export function SidebarDefault() {
  return (
    <>
      <div>
        {/* Identity */}
        <div className="mb-6 animate-in ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
          <h1 className="text-xl font-semibold tracking-tight text-ink">Chayut C.</h1>
          <p className="mt-1.5 text-xs text-muted">Design Engineer</p>
        </div>

        <p className="mb-8 max-w-[220px] animate-in text-xs leading-relaxed text-dim delay-[80ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
          Welcome! I&apos;m Chayut, and you&apos;re in my digital playground. It&apos;s a collection
          of my experiments on interaction and interface design. Feel free to explore!
        </p>

        {/* Separator */}
        <div
          className="mb-6 h-px w-10 origin-left animate-expand-line bg-mid"
          style={{ animationDelay: "160ms" }}
        />

        {/* Navigation */}
        <div className="animate-in delay-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
          <SidebarNav />
        </div>
      </div>

      {/* Bottom */}
      <div className="animate-in delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
        <SidebarFooter />
      </div>
    </>
  );
}
