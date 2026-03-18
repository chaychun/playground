"use client";

import { Component as ReactComponent, lazy } from "react";
import type { ComponentType, ReactNode } from "react";

const previewCache = new Map<string, React.LazyExoticComponent<ComponentType>>();

function getLazyPreview(slug: string) {
  let component = previewCache.get(slug);
  if (!component) {
    component = lazy(() => import(`@/playground/${slug}/preview`));
    previewCache.set(slug, component);
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
        <div className="flex h-full items-center justify-center text-meta text-muted">
          Failed to load
        </div>
      );
    }
    return this.props.children;
  }
}

export function LazyPreviewComponent({ slug }: { slug: string }) {
  const Component = getLazyPreview(slug);
  return (
    <CellErrorBoundary>
      <Component />
    </CellErrorBoundary>
  );
}
