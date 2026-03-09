import type { PreviewConfig } from "@/lib/types";

let activePreview: PreviewConfig | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const transitionStore = {
  setActive(preview: PreviewConfig | null) {
    activePreview = preview;
    notify();
  },

  getActive() {
    return activePreview;
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
