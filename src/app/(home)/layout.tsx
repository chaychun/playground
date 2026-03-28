import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SpeedProvider } from "@/components/speed-control";
import { SpeedToggle } from "@/components/speed-toggle";
import { StickyHeader } from "@/components/sticky-header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SpeedProvider>
      <div className="mx-auto max-w-[680px] px-6">
        <StickyHeader>
          <div className="flex items-center justify-between">
            <BreadcrumbNav />
            <SpeedToggle />
          </div>
        </StickyHeader>
        <main style={{ paddingTop: 72 }}>{children}</main>
      </div>
    </SpeedProvider>
  );
}
