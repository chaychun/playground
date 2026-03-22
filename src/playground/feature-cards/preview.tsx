import dynamic from "next/dynamic";

export const frame = { minHeight: 440 };

const FeatureCards = dynamic(() => import("./feature-cards").then((m) => m.FeatureCards));

export default function Preview() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <FeatureCards />
    </div>
  );
}
