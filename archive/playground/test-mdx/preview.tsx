import type { Item } from "@/lib/types";

export const frame: Item["previewFrame"] = {
  aspectRatio: "4/3",
};

export default function Preview() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface text-sm font-medium text-dim">
      Link to Google
    </div>
  );
}
