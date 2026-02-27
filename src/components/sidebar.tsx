export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-svh w-[340px] shrink-0 animate-fade-in flex-col justify-between border-r border-border/40 px-8 py-8 lg:flex">
      {children}
    </aside>
  );
}
