import dynamic from "next/dynamic";

export const frame = { minHeight: 360 };

const VariableFontSelector = dynamic(() => import("./variable-font-selector"));

export default function Preview() {
  return <VariableFontSelector />;
}
