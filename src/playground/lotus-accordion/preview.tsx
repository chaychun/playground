import dynamic from "next/dynamic";

export const frame = { minHeight: 420 };

const LotusAccordion = dynamic(() => import("./lotus-accordion").then((m) => m.LotusAccordion));

const items = [
  {
    id: "lorem-1",
    title: "Lorem ipsum dolor sit amet",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: "lorem-2",
    title: "Consectetur adipiscing elit",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
  },
  {
    id: "lorem-3",
    title: "Sed do eiusmod tempor",
    content:
      "Ut labore et dolore magna aliqua. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  },
];

export default function Preview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm">
        <LotusAccordion items={items} />
      </div>
    </div>
  );
}
