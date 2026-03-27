import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { StickyHeader } from "@/components/sticky-header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative mx-auto max-w-[680px] px-6">
      <StickyHeader>
        <BreadcrumbNav />
      </StickyHeader>
      <main>{children}</main>
    </div>
  );
}
