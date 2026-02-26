"use client";

export default function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface">
      <span className="text-xl font-medium text-muted">{name}</span>
    </div>
  );
}
