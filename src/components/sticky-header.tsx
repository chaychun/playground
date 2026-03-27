export function StickyHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute top-0 right-0 left-0 z-50 mix-blend-difference print:hidden"
      style={{ paddingTop: 40, paddingBottom: 4 }}
    >
      {children}
    </div>
  );
}
