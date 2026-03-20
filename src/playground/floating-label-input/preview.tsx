import dynamic from "next/dynamic";

export const frame = { minHeight: 160 };

const FloatingLabelDemo = dynamic(() => import("./floating-label-input"));

export default function Preview() {
  return <FloatingLabelDemo />;
}
