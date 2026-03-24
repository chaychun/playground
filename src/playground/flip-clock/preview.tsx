import dynamic from "next/dynamic";

export const frame = { aspectRatio: "16/9", minHeight: 280 };

const FlipClock = dynamic(() => import("./flip-clock"));

export default function Preview() {
  return <FlipClock />;
}
