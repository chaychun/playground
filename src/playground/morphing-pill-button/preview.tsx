import { SpeedControl } from "@/components/speed-control";
import dynamic from "next/dynamic";

export const frame = { minHeight: 160 };

const MorphingPillButton = dynamic(() =>
  import("./morphing-pill-button").then((m) => m.MorphingPillButton),
);

export default function Preview() {
  return (
    <SpeedControl slowFactor={0.33}>
      <div className="absolute inset-0 flex items-center justify-center">
        <MorphingPillButton />
      </div>
    </SpeedControl>
  );
}
