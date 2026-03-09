"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

const transition = { duration: 0.3, ease: "easeInOut" as const };

export function BreadcrumbNav() {
  const pathname = usePathname();
  const router = useRouter();
  const page = pathname.split("/").find(Boolean);
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Track the previous pathname so we know if back() would return to home
    return () => {
      prevPathRef.current = pathname;
    };
  }, [pathname]);

  function goHome() {
    if (prevPathRef.current === "/") {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <nav
      className="flex items-center gap-1.5 font-mono text-[13px] tracking-[0.02em] whitespace-nowrap select-none"
      aria-label="Breadcrumb"
    >
      {page ? (
        <button
          type="button"
          onClick={goHome}
          className="cursor-pointer text-ink transition-colors hover:text-accent"
        >
          chayut.me
        </button>
      ) : (
        <span className="text-ink">chayut.me</span>
      )}
      <span className="text-muted">/</span>
      <AnimatePresence mode="popLayout">
        {page && (
          <motion.span
            key={page}
            className="text-dim"
            initial={{ opacity: 0, filter: "blur(4px)", x: -8 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            exit={{ opacity: 0, filter: "blur(4px)", x: -8 }}
            transition={transition}
          >
            {page}
          </motion.span>
        )}
      </AnimatePresence>
    </nav>
  );
}
