import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-[680px] px-6">
      <div className="pt-10 pb-1 print:hidden">
        <BreadcrumbNav />
      </div>
      <main>{children}</main>
    </div>
  );
}
