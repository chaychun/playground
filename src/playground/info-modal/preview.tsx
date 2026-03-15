import dynamic from "next/dynamic";

export const frame = { aspectRatio: "4/3" };

const InfoModal = dynamic(() => import("./component"));

export default function Preview() {
  return <InfoModal />;
}
