import dynamic from "next/dynamic";

export const frame = { minHeight: 480 };

const VoiceCapture = dynamic(() => import("./component"));

export default function Preview() {
  return <VoiceCapture />;
}
