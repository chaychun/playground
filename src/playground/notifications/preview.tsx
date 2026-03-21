import dynamic from "next/dynamic";

export const frame = { minHeight: 440 };

const ActivityDropdown = dynamic(() =>
  import("./activity-dropdown").then((m) => m.ActivityDropdown),
);

export default function Preview() {
  return (
    <div className="force-dark absolute inset-0 flex items-center justify-center p-6">
      <ActivityDropdown />
    </div>
  );
}
