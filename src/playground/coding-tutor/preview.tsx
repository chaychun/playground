import dynamic from "next/dynamic";

export const frame = { aspectRatio: "16/10" };

const PreviewVideo = dynamic(() => import("@/components/preview/preview-video"));

export default function Preview() {
  return (
    <PreviewVideo src="https://media.contra.com/video/upload/fl_progressive/w_1900/vlml3lrovlkyyb6a7jk3.mp4" />
  );
}
