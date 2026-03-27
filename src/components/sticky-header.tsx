export function StickyHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed top-0 left-1/2 z-50 w-full max-w-[680px] -translate-x-1/2 px-6 mix-blend-difference print:hidden"
      style={{ paddingTop: 40, paddingBottom: 4 }}
    >
      {children}
    </div>
  );
}
