export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-svh w-[340px] shrink-0 animate-in flex-col justify-between px-8 py-8 ease-out animation-duration-700 fill-mode-both fade-in lg:flex">
      {children}
    </aside>
  );
}
