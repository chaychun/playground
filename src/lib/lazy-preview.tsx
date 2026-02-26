"use client";

import { Component as ReactComponent, Suspense, lazy } from "react";
import type { ComponentType, ReactNode } from "react";

const cache = new Map<string, React.LazyExoticComponent<ComponentType<Record<string, unknown>>>>();

function getLazyPreview(name: string) {
  let component = cache.get(name);
  if (!component) {
    component = lazy(() => import(`@/preview/${name}`));
    cache.set(name, component);
  }
  return component;
}

class PreviewErrorBoundary extends ReactComponent<
  { children: ReactNode },
  { hasError: boolean }
> {
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

export function LazyPreviewComponent({
  name,
  props,
}: {
  name: string;
  props?: Record<string, unknown>;
}) {
  const Component = getLazyPreview(name);
  return (
    <PreviewErrorBoundary>
      <Suspense fallback={<div className="h-full w-full bg-surface" />}>
        <Component {...props} />
      </Suspense>
    </PreviewErrorBoundary>
  );
}
