import { MobileFooter } from "@/components/mobile-footer";
import { MobileHeader } from "@/components/mobile-header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark flex min-h-svh flex-col bg-paper lg:h-svh lg:overflow-hidden">
      <MobileHeader />
      <main className="min-w-0 flex-1">{children}</main>
      <MobileFooter />
    </div>
  );
}
