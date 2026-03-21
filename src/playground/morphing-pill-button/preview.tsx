import dynamic from "next/dynamic";

export const frame = { minHeight: 160 };

const MorphingPillButton = dynamic(() =>
  import("./morphing-pill-button").then((m) => m.MorphingPillButton),
);

export default function Preview() {
  return (
    <div className="flex h-full items-center justify-center">
      <MorphingPillButton />
    </div>
  );
}
