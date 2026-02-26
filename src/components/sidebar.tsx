export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-svh w-[340px] shrink-0 flex-col justify-between px-8 py-8 lg:flex">
      {children}
    </aside>
  );
}
