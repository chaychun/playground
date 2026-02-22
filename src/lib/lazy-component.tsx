"use client";

import { Suspense, lazy } from "react";
import type { ComponentType, ReactNode } from "react";

const cache = new Map<string, React.LazyExoticComponent<ComponentType>>();

function getLazyComponent(slug: string) {
  let component = cache.get(slug);
  if (!component) {
    component = lazy(() => import(`@/playground/${slug}/component`));
    cache.set(slug, component);
  }
  return component;
}

export function LazyPlaygroundComponent({
  slug,
  fallback,
}: {
  slug: string;
  fallback?: ReactNode;
}) {
  const Component = getLazyComponent(slug);
  return (
    <Suspense fallback={fallback ?? null}>
      <Component />
    </Suspense>
  );
}
