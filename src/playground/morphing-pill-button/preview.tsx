import dynamic from "next/dynamic";

export const frame = { minHeight: 160 };

const MorphingPillButton = dynamic(() =>
  import("./morphing-pill-button").then((m) => m.MorphingPillButton),
);

export default function Preview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <MorphingPillButton />
    </div>
  );
}
