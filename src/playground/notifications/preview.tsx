import { SpeedControl } from "@/components/speed-control";
import dynamic from "next/dynamic";

export const frame = { minHeight: 440 };

const ExpandableNotification = dynamic(() =>
  import("./expandable-notification").then((m) => m.ExpandableNotification),
);

export default function Preview() {
  return (
    <SpeedControl slowFactor={0.25}>
      <div className="force-dark absolute inset-0 flex items-center justify-center p-6">
        <ExpandableNotification />
      </div>
    </SpeedControl>
  );
}
