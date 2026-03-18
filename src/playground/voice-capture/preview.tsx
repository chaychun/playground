import dynamic from "next/dynamic";

export const frame = { minHeight: 480 };

const VoiceCapture = dynamic(() => import("./voice-capture"));

export default function Preview() {
  return <VoiceCapture />;
}
