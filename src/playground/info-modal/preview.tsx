import dynamic from "next/dynamic";

export const frame = { aspectRatio: "4/3", minHeight: 450 };

const InfoModal = dynamic(() => import("./info-modal"));

export default function Preview() {
  return <InfoModal />;
}
