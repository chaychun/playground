"use client";

import { Component as ReactComponent, Suspense, lazy } from "react";
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

class CellErrorBoundary extends ReactComponent<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center text-xs text-muted">
          Failed to load
        </div>
      );
    }
    return this.props.children;
  }
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
    <CellErrorBoundary>
      <Suspense fallback={fallback ?? null}>
        <Component />
      </Suspense>
    </CellErrorBoundary>
  );
}
